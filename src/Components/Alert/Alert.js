import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const MySwal = withReactContent(Swal);

export const showSuccess = async (title, text) => {
  return MySwal.fire({
    title: title,
    html: text,
    icon: "success",
    confirmButtonText: "OK",
  });
};
