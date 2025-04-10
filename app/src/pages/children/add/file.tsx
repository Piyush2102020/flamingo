import React, { useState } from 'react';
import './style.css';
import axiosInstance from '../../../helpers/axiosModified';
import { TextHint } from '../../../newComponents/Generics/GenericText/file';
import { Holder } from '../../../newComponents/Generics/GenericHolders/file';
import { AccentButton } from '../../../newComponents/Clickables/buttons/file';
import { ConditionalRendererWithDefault } from '../../../newComponents/Generics/GenericConditionlRender/file';

export default function AddPost() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filePath, setPath] = useState("");
    const [text, setText] = useState("");
    const [visibility, setVisibility] = useState("Public");

    const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
            setPath(URL.createObjectURL(event.target.files[0]));
        }
    };


    const postButton = async () => {
        const formData = new FormData();
        if (selectedFile) {
            formData.append('image', selectedFile);
        }
        formData.append('content', text);
        // formData.append('tags',tags);
        formData.append('visibility', visibility.toLowerCase());

        await axiosInstance.post('/content', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        setText("");
        setSelectedFile(null);
        setPath("");
    }

    return (

        <Holder classname='addpost'>

            <ConditionalRendererWithDefault
                condition={!selectedFile}
                component={<div className='image-container'>
                    <img
                        src='/icons/photo.png'
                        className='image-preview'
                        alt="Preview"
                    />
                    <Holder classname='file-input-wrapper'>
                        <input
                            id="fileUpload"
                            onChange={handleFileInput}
                            type="file"
                            accept="image/*"
                            className="hidden-file-input"
                        />
                        <AccentButton text='Pick an image' />
                    </Holder>
                </div>}


                defaultComponent={
                <div className='post-preview-wrapper'>
                    <Holder >
                        <div style={{ position: 'relative', width: 'fit-content' }}>

                            <input
                                id="fileUpload"
                                onChange={handleFileInput}
                                type="file"
                                accept="image/*"
                                className="hidden-file-input"
                            />

                            <img className='image-preview' src={filePath} />
                            <TextHint text='Tap to change' />
                        </div>

                    </Holder>

                    <Holder classname='post-content'>

                        <textarea onChange={(e) => setText(e.target.value)} className='input' placeholder='Write Something...' />

                        <div style={{ width: '100%' }}>
                            <h6>Mentions & Tags</h6>
                            <textarea className='input' placeholder='@Mention your closer ones' />
                        </div>



                        <div className='add-btn-holder'>
                            <select onChange={(e) => setVisibility(e.target.value)} className='select'>
                                <option className='select'>Public</option>
                                <option className='select'>Private</option>
                            </select>
                        </div>

                        <AccentButton onClick={postButton} text='Make a post' />


                    </Holder>

                </div>}
            />
        </Holder>
    );
}
