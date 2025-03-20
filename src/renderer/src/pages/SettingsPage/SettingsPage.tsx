import React from 'react'
import { useNavigate } from 'react-router-dom'

export function SettingsPage(): React.JSX.Element {
    const navigate = useNavigate();

    return (
        <div>
            <button onClick={() => navigate(-1)}>
                Back
            </button>
        </div>
    )
}
