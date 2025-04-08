import React from "react";

const DisplaySVG: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <img
                src="/src/datastructures-and-algorithms.svg"
                alt="Data Structures and Algorithms"
                className="max-w-full h-auto rounded-lg shadow-md bg-white"
            />
        </div>
    );
};

export default DisplaySVG;
