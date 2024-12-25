import React from 'react'

const Spinner = ({color}: {
  color: String
}) => {
  return (
    <>
    <button
        type="button"
        className={`pointer-events-none inline-block rounded bg-primary px-2 text-xs font-medium uppercase leading-normal text-${color} shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 disabled:opacity-70 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong`}
        disabled
    >
        <div
            className="inline-block h-6 w-6 animate-spin rounded-full border-[3px] border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status">
                <span
                className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
            >Loading...</span>
        </div>
    </button></>
  )
}

export default Spinner