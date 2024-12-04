import { useState, useEffect } from "react";
import { Avatar } from "@chakra-ui/react";
import useProfileImageStore from "../../stores/profileImageStore";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ProfileImage = ({ userId, size }) => {
    const [imageSrc,setImageSrc] = useState(null);
    const [userName, setUserName] = useState("");
    const imageVersion = useProfileImageStore((state)=>state.imageVersion) ?? 0;


    useEffect(()=> {
        const fetchProfileImage = async () => {
            const response = await fetch(`${BACKEND_URL}/profiles/${userId}`);
            const data = await response.json();
            
            if (data.imageUrl) {
                setImageSrc(data.imageUrl + "?v" + imageVersion);
                setUserName(data.fullName);
            } else {
                setUserName(data.fullName);
            }
        }
        fetchProfileImage();
    },[userId, imageVersion, userName]);

    return (
        <>
            <Avatar size={size} name={userName} src={imageSrc}>
            </Avatar>
        </>
    )
}

export default ProfileImage;