const ModalTodo = ({ closeModal, handleModalUpdate }) => {
  return (
    <>
      <button type="button" onClick={handleModalUpdate}>
        변경
      </button>
      <button type="button" onClick={closeModal}>
        x
      </button>
    </>
  );
};

export default ModalTodo;
