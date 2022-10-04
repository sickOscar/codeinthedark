const LogoFooter = () => {
    return (
        <div className="absolute bottom-4 left-0 right-3 h-8 text-white text-center flex justify-center">
            <p className=" opacity-60">Brought to you with ❤️ by</p>
            <div className="mt-1">
                <img src="interlogica.png" alt="interlogica logo" className="w-full max-w-xs ml-4" />
            </div>
        </div>
    )
}

export default LogoFooter;