import { useState, useEffect } from "react";
import { Avatar } from "@chakra-ui/react";
import useProfileImageStore from "../../stores/profileImageStore";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const IMAGE_PLACEHOLDER = "https://bit.ly/sage-adebayo";

const ProfileImage = ({ userId, size }) => {
    const [imageSrc,setImageSrc] = useState(null);
    const imageVersion = useProfileImageStore((state)=>state.imageVersion) ?? 0;


    useEffect(()=> {
        const fetchProfileImage = async () => {
            const response = await fetch(`${BACKEND_URL}/profiles/${userId}`);
            const data = await response.json();
            if (data.imageUrl) {
                setImageSrc(data.imageUrl + "?v" + imageVersion);
            } else {
                setImageSrc(IMAGE_PLACEHOLDER);
            }
        }
        fetchProfileImage();
    },[userId, imageVersion]);

    return (
        <>
            <Avatar size={size} src={imageSrc}>
            </Avatar>
        </>
    )
}

export default ProfileImage;