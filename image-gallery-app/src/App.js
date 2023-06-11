import React, { useState, useRef, useEffect } from 'react'
import Webcam from 'react-webcam'

const videoConstraints = {
    width: 300,
    height: 300,
    facingMode: 'user',
}

const webcam = {
    "display": "block",
    "margin": "auto",
    "border": "30px outset #fff",
    "height": videoConstraints.height,
    "width": videoConstraints.width
}

const App = () => {

    const [picture, setPicture] = useState('')
    const [images, setImages] = useState('')
    const [permissionError, setPermissionError] = useState('')

    const webcamRef = useRef(null)

    //Take browser webcam permission
    const requestCameraPermission = () => {
        navigator.mediaDevices.getUserMedia({ video: true }).then(mediaStream => {
            console.log("Camera Permission Allowed Successfully")
        }).catch(err => {
            setPermissionError(err.message)
        });
    }

    //Take photo from webcam
    const capture = () => {
        const audio = document.getElementById("audio")
        const pictureSrc = webcamRef.current.getScreenshot()
        setPicture(pictureSrc)
        audio.play()
    }

    const reset = () => {
        setPicture("")
    }

    const save = () => {
        setImages([picture, ...images])
        setPicture('')
    }

    //upload photo from gallery
    const handleImageUpload = (e) => {
        let reader = new FileReader();
        reader.onloadend = () => setImages([reader.result, ...images])
        reader.readAsDataURL(e.target.files[0])
    }

    useEffect(() => {
        requestCameraPermission()
    }, [])

    return (
        <div className='container'>
            <div style={{ marginTop: '50px' }}>

                {permissionError !== '' &&
                    <div style={webcam}>
                        <p className='text-center'><b>{permissionError}</b></p>
                    </div>
                }

                <audio id="audio" src={require('./sound.mp3')} ></audio>

                <input
                    type="file"
                    accept='.jpg, .png, .jpeg'
                    onChange={handleImageUpload}
                />

                {(picture === '' && permissionError === '') &&
                    <div className='row text-center'>
                        <div className='col-sm-12'>
                            <Webcam
                                audio={false}
                                height={videoConstraints.height}
                                ref={webcamRef}
                                width={videoConstraints.width}
                                screenshotFormat="image/jpeg"
                                videoConstraints={videoConstraints}
                                style={webcam}
                            />
                        </div>
                        <div className='col-sm-12' style={{ marginTop: '5px' }}>
                            <button onClick={capture} className='btn btn-primary'> Capture </button>
                        </div>
                    </div>
                }

                {picture !== '' &&
                    <div className='row text-center'>
                        <div className='col-sm-12'>
                            <img alt="preview" style={webcam} src={picture} />
                        </div>
                        <div className='col-sm-12' style={{ marginTop: '5px' }}>
                            <button onClick={save} className='btn btn-primary'> Save </button> &nbsp;&nbsp;&nbsp;
                            <button onClick={reset} className='btn btn-danger'> Cancel </button>
                        </div>
                    </div>
                }

                <br /> <br /> <br />
                <div className='row'>
                    {images?.map((image, index) => {
                        return <div key={index} style={{ marginBottom: '20px' }} className='col-sm-4'>
                            <img alt='image' style={{ width: '240px', height: '240px' }} className='img img-thumbnail' src={image} />
                        </div>
                    })}
                </div>

            </div>
        </div>
    )
}

export default App;