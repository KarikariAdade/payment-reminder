import {faCoffee, faEdit, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {JSX} from "react";

export const Button = ({
                           defaultText,
                           type,
                           btnClass,
                           isLoading = false,
                           icon,
                           clickFunction = () => {
                           }
                       }) => {
    // inline-flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm text-white shadow-xs focus:relative

    let iconType: JSX.Element;

    if (icon === 'submit')
        iconType = (<FontAwesomeIcon icon={faCoffee}/>)
    else if (icon === 'delete')
        iconType = (<FontAwesomeIcon icon={faTrash}/>)
    else if (icon === 'edit')
        iconType = (<FontAwesomeIcon icon={faEdit}/>)

    console.log(icon)
    return (
        <>
            <button
                onClick={clickFunction}
                type={type}
                className={btnClass}
            >
                {iconType}


                {
                    isLoading ? "Processing..." : (defaultText)
                }
            </button>

        </>
    )

}