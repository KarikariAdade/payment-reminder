import React from "react";

export const Input = ({
                          type = 'text',
                          id,
                          classname = null,
                          placeholder,
                          label,
                          name,
                          value,
                          errorMsg = '',
                          onChange = () => {
                          }
                      }) => {

    return (
        <>
            <div className={classname}>
                <label htmlFor={name}
                       className="relative block rounded-md border border-gray-200 shadow-xs focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                    <input
                        type={type}
                        id={id}
                        name={name}
                        value={value}
                        className="peer w-full border-none bg-transparent placeholder-transparent focus:border-transparent focus:ring-0 focus:outline-hidden h-12 p-2"
                        placeholder={placeholder}
                        onChange={onChange}
                    />

                    <span
                        className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                                            {label}
                                        </span>
                </label>
                {
                    errorMsg !== '' ? (<small className="text-red-500 text-sm">{errorMsg}</small>) : null
                }

            </div>
        </>
    )

}