import React, { useState } from 'react';
import './style.css';
import axiosInstance from '../../../helpers/axiosModified';

export default function AddPost() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filePath, setPath] = useState("");
    const [text, setText] = useState("");
    const [tags, setTagss] = useState("");
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
        setTagss("");
        setSelectedFile(null);
        setPath("");
    }

    return (
        <div className='addpost'>
            {!selectedFile ? <div className='image-container'>
                <img
                    src='/icons/photo.png'
                    className='image-preview'
                    alt="Preview"
                />

                <div className="file-input-wrapper">
                    <input
                        id="fileUpload"
                        onChange={handleFileInput}
                        type="file"
                        accept="image/*"
                        className="hidden-file-input"
                    />
                    <button className='btn accent'>Pick an image</button>
                </div>
            </div> :
                <div className='post-preview-wrapper'>
                    <div style={{ position: 'relative', width: 'fit-content' }}>
                        <input
                            id="fileUpload"
                            onChange={handleFileInput}
                            type="file"
                            accept="image/*"
                            className="hidden-file-input"
                        />
                        <img className='image-preview' src={filePath} />
                        <h4 style={{ textAlign: "center" }} className='text-light'>Tap to change</h4>
                    </div>


                    <div className='post-content'>
                        <textarea onChange={(e) => setText(e.target.value)} className='input' placeholder='Write Something...' />
                        <div style={{ width: '100%' }}>
                            <h6>Mentions & Tags</h6>
                            <textarea className='input' placeholder='@Mention your closer ones' />
                        </div>

                        <div className='add-btn-holder'>

                            <div className='add-btns'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
                                </svg>Add Music

                            </div>

                            <select onChange={(e) => setVisibility(e.target.value)} className='select'>
                                <option className='select'>Public</option>
                                <option className='select'>Private</option>
                            </select>



                        </div>

                        <button onClick={postButton} className='btn accent'>Make a post</button>
                    </div>
                </div>}
        </div>
    );
}
