import React from 'react'

const CreateCategory = (onCreateCategory) => {
    const goBackToTasks = () => {
        onCreateCategory = false;
    }
    return (
        <div>
            <h1>Create Category</h1>
            <button onClick={goBackToTasks}>Go To Tasks</button>
        </div>
    )
}

export default CreateCategory