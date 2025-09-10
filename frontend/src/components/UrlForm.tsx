import React, { FormEvent, ChangeEvent } from 'react'

// 1-1 기능 추가 완료


type Props = {
    value: string
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    onSubmit: (value: string) => void
}

const UrlForm = ({ value, onChange, onSubmit }: Props) => {
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        onSubmit(value)
    }
    return (
        <form onSubmit={handleSubmit}>
            <label
                htmlFor="github_url"
                className="mb-2 block text-sm font-medium text-gray-900"
            >
                Github PR/Commit Link
            </label>
            <div className="flex flex-row">
                <input
                    type="text"
                    id="github_url"
                    value={value}
                    onChange={onChange}
                    className="block w-full grow rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900
                     focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700
                     dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    placeholder="https://github.com/fika-dev/fika-cli/pull/331"
                    required
                />
                <div className="w-4"></div>
                <button
                    type="submit"
                    className="w-full rounded-lg bg-sky-900 px-5 py-2.5 text-center text-sm font-medium text-cyan-300
                     hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto
                     dark:bg-sky-900 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    Submit
                </button>
            </div>
        </form>
    )
}

export default UrlForm
