export default function SectionDivider() {
    return (
        <div className="w-full overflow-hidden leading-[0] transform rotate-180 z-20 relative -mt-1">
            <svg
                className="w-full text-paper h-12 md:h-24"
                preserveAspectRatio="none"
                viewBox="0 0 1200 120"
                xmlns="http://www.w3.org/2000/svg"
                style={{ fill: 'currentColor' }}
            >
                <path d="M0,0V46.29c47,24.33,74.5,43,103,42.44,55.5-1.12,47-51.57,118-20.91,33,14.36,65.5,50.5,99.5,49.5,50-1.46,55-58.46,104-51.46,41,5.82,49,50,91,48,77-3.64,57-61.94,115-46.91,41,10.63,48,51,91,51,69,0,67-47.5,123-38.5,88.5,14.28,103.5,63.28,155,59.28,87.5-6.75,81-79.75,200-58.75V0Z" />
            </svg>

            <div className="absolute bottom-4 left-0 w-full border-b-2 border-dashed border-pencil/20" />
        </div>
    );
}
