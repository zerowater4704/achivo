import User from "../models/User";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../utils/token";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res
        .status(400)
        .json({ message: "既に登録されているメールアドレスです。" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      name,
      password: hashedPassword,
    });

    const accessToken = generateAccessToken({ id: user.id });
    const refreshToken = generateRefreshToken({ id: user.id });

    await user.save();
    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({ accessToken, user });
  } catch (error) {
    console.error("Error in createUser:", error);
    res.status(500).json({ message: "createUser apiのエラーです。", error });
    return;
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({
        message: "入力されたメールアドレスが間違っています。",
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res
        .status(401)
        .json({ message: "入力されたパスワードが間違っています。" });
      return;
    }

    const accessToken = generateAccessToken({ id: user.id });
    const refreshToken = generateRefreshToken({ id: user.id });

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        path: "/",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({ accessToken, user });
  } catch (error) {
    res.status(500).json({ message: "loginUser APIのエラーです。", error });
    return;
  }
};

export const logout = (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(400).json({ message: "ログアウトするトークンがありません。" });
      return;
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    res.status(200).json({ message: "LogOutできました。" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "ログアウト中にエラーが発生しました。", error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "ユーザーを見つかりません。" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "パスワードが間違っています。" });
      return;
    }

    await User.findByIdAndDelete(user);

    res.status(200).json({ message: "ユーザーを削除しました。" });
  } catch (error) {
    res.status(500).json({ message: "deleteUser apiで失敗しました。" });
  }
};

export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(403).json({ message: "リフレッシュトークンがありません。" });
      return;
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN!,
      async (
        err: VerifyErrors | null,
        payload: string | JwtPayload | undefined
      ) => {
        if (err) {
          return res
            .status(403)
            .json({ message: "無効なリフレッシュトークンです。" });
        }

        if (typeof payload === "string" || !payload) {
          return res.status(403).json({ message: "無効なペイロードです。" });
        }

        const userId = (payload as jwt.JwtPayload).id;
        const user = await User.findById(userId);

        if (!user) {
          return res.status(404).json({ message: "ユーザーが存在しません。" });
        }

        const newAccessToken = jwt.sign(
          { id: user.id },
          process.env.ACCESS_TOKEN!,
          { expiresIn: "15m" }
        );

        res.status(200).json({ accessToken: newAccessToken });
      }
    );
  } catch (error) {
    res
      .status(500)
      .json({ message: "トークン再発行中にエラーが発生しました。" });
  }
};
