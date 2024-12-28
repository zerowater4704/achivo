import { useState } from "react";
import { FaEllipsisH, FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

interface ToggleMenuProps {
  todoId: string; // ID
  handelEditClick: (id: string) => void; // 編集ハンドラー
  handelDeleteClick: (id: string) => void; // 削除ハンドラー
}

const ToggleMenu: React.FC<ToggleMenuProps> = ({
  todoId,
  handelEditClick,
  handelDeleteClick,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuOpen = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div className=" relative">
      <button onClick={menuOpen} className="p-2">
        <FaEllipsisH className="text-2xl" />
      </button>

      {isMenuOpen && (
        <div>
          <button onClick={() => handelEditClick(todoId)}>Edit</button>
          <button onClick={() => handelDeleteClick(todoId)}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default ToggleMenu;
