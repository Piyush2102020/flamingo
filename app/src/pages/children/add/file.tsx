import React, { useEffect, useRef, useState } from 'react';
import axiosInstance from '../../../helpers/axiosModified';
import { TextHint } from '../../../newComponents/Generics/GenericText/file';
import { Holder } from '../../../newComponents/Generics/GenericHolders/file';
import { AccentButton } from '../../../newComponents/Clickables/buttons/file';
import { ConditionalRendererWithDefault } from '../../../newComponents/Generics/GenericConditionlRender/file';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { togglePleaseWait } from '../../../helpers/slice';
import { ServerRoutes } from '../../../helpers/serverRoutes';

export default function AddPost() {


    // ------------------------------ State Variables ------------------------------
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedFilePath, setSelectedFilePath] = useState("");
    const [caption, setCaption] = useState("");
    const [visibility, setVisibility] = useState("Public");
    const videoRef=useRef<HTMLVideoElement|null>(null);
    const [fileType, setFileType] = useState("image");
    const dispatch=useDispatch();


    // ------------------------------ Helper Functions ------------------------------
    const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedFile(file);
            setFileType(file.type.startsWith('video/') ? 'video' : "image");
            setSelectedFilePath(URL.createObjectURL(event.target.files[0]));
        }
    };

    // ------------------------------ To check video length ------------------------------
    useEffect(() => {
        if (fileType === "video" && videoRef.current) {
            const video = videoRef.current;

            const handleLoadedMetadata = () => {
                if (video.duration > 30) {
                    setSelectedFile(null);
                    setSelectedFilePath("");
                    setCaption("");
                    toast.error("Video can't be longer than 30 seconds");
                }
            };
    
            video.addEventListener('loadedmetadata', handleLoadedMetadata);
    
            return () => {
                video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            };
        }
    }, [selectedFilePath, fileType]);
    

    // ------------------------------ Posting Button ------------------------------
    const createPost = async () => {
        dispatch(togglePleaseWait());

        const formData = new FormData();
        if (selectedFile) {
            formData.append('media', selectedFile);
        }

        formData.append('content', caption);
        formData.append('visibility', visibility.toLowerCase());

        await axiosInstance.post(ServerRoutes.postRoutes.content(), formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        setCaption("");
        setSelectedFile(null);
        setSelectedFilePath("");
        dispatch(togglePleaseWait());
    }






    return (

        <Holder classname='addpost'>

            <ConditionalRendererWithDefault
                condition={!selectedFile}
                component={<div style={{ justifyContent: "center", alignItems: "center" }} className='image-container'>


                    <img

                        src='/icons/photo.png'
                        className='image-preview'
                        alt="Preview"
                        style={{ width: "300px", alignSelf: "center" }}
                    />


                    <Holder style={{ width: "90%" }} classname='file-input-wrapper'>
                        <input
                            id="fileUpload"
                            onChange={handleFileInput}
                            type="file"
                            accept="image/*,video/*"
                            className="hidden-file-input"
                        />
                        <AccentButton text='Pick an image' />
                    </Holder>
                </div>}


                defaultComponent={
                    <div className='post-preview-wrapper'>
                        <Holder style={{width:"fit-content",padding:"var(--padding-small)"}} >
                            <div style={{ position: 'relative', width: 'fit-content' }}>
                                <input
                                    id="fileUpload"
                                    onChange={handleFileInput}
                                    type="file"
                                    accept="image/*,video/*"
                                    className="hidden-file-input"
                                />
                                 <ConditionalRendererWithDefault
                                    condition={fileType == 'image'}
                                    component={
                                        <img className='image-preview' src={selectedFilePath} />}
                                    defaultComponent={
                                        <video ref={videoRef} loop={true} style={{width:"300px"}} autoPlay={true} src={selectedFilePath}/>
                                    }
                                />

                               
                                <TextHint style={{textAlign:"center"}} text='Tap to change' />
                            </div>

                        </Holder>

                        <Holder classname='post-content'>

                            <textarea onChange={(e) => setCaption(e.target.value)} className='input' placeholder='Write Something...' />

    

                            {/* <div className='add-btn-holder'>
                                <select onChange={(e) => setVisibility(e.target.value)} className='select'>
                                    <option className='select'>Public</option>
                                    <option className='select'>Private</option>
                                </select>
                            </div> */}

                            <AccentButton onClick={createPost} text='Make a post' />


                        </Holder>

                    </div>}
            />
        </Holder>
    );
}
