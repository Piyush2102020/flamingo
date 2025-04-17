import '../componentsGlobal.css'
export default function PleaseWait() {
    return (
        <div className='loader-page'>
            <div className="loader-wrapper">
                <div className="circular-loader"></div>
                <p className="loader-text">Please wait...</p>
            </div>
        </div>

    );
}
