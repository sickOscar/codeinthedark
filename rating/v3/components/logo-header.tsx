import { NextPage } from "next";

const LogoHeader: NextPage = () => {
    return (
        <div className="bg-citd-purple w-full h-16 p-4 flex justify-center">
            <img src="/citdlogo.svg" alt="Code in the Dark logo" className="h-9 w-auto align-middle" />
        </div>
    )
}

export default LogoHeader;