import {
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalOverlay,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Button,
    ModalContent,
    ModalFooter,
    useToast,
    Flex,
} from '@chakra-ui/react'
import { useState } from 'react';
import useProfileImageStore from '../../stores/profileImageStore';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const FileUploadDialog = ({ userId, isOpen, onClose }) => {

    const [selectedFile, setSelectedFile] = useState(null);
    const toast = useToast();
    const incrementImageVersion = useProfileImageStore((state)=>state.incrementImageVersion);
    const imageVersion = useProfileImageStore((state)=>state.imageVersion);

    const handleFileChange = (e)=> {
        setSelectedFile(e.target.files[0]);
    }

    const handleSave = async(e)=> {
        e.preventDefault();
        if (!selectedFile) {
            return (
                toast({
                    title: 'Error uploading file',
                    description: 'Please select image to upload',
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                })
            )
        }

        if (selectedFile.size > 1024 * 1024) {
            return (
                toast({
                    title: 'Error uploading file',
                    description: 'The file size should be 1MB or less',
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                })
            )
          }

          const formData = new FormData();
          formData.append('profileImage',selectedFile);

          try {
            const response = await fetch(`${BACKEND_URL}/profiles/${userId}/upload`, {
                method: 'PATCH',
                body: formData,
            });

            if(!response.ok) {
                throw new Error("Backend response was not ok");
            }

            incrementImageVersion();
            console.log(imageVersion);
            onClose();
            return (
                toast({
                    title: 'File uploaded',
                    description: 'File uploaded successfully',
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                })
            )

          }catch(error){
            return (
                toast ({
                    title: "Error uploading file",
                    description: `Error occures during uploading: ${error}`,
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                })
            )
          }
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Select Image</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Choose a file:</FormLabel>
                            <Input type="file" accept="image/*" onChange={handleFileChange}/>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Flex gap = {4}>
                            <Button colorScheme='blue' onClick={handleSave}>Save</Button>
                            <Button colorScheme="red" onClick={onClose}>Cancel</Button>
                        </Flex>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default FileUploadDialog;