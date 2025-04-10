import { useEffect, useState } from 'react'
import './style.css'
import axiosInstance from '../../../helpers/axiosModified';
import GenericHeader from '../../../components/GenericHeader/file';
import { useNavigate } from 'react-router-dom';
import { SmallIcon } from '../../../newComponents/Clickables/icons/file';
import { BasicInputField } from '../../../newComponents/Clickables/fields/file';
import { Holder } from '../../../newComponents/Generics/GenericHolders/file';



export default function Search() {
    const [query, setQuery] = useState('');
    const [user, setUsers] = useState<[any]>([{}]);
    const navigate = useNavigate();

    const search = async () => {
        setUsers([{}])
        if (query.trim()) {
            const response = await axiosInstance.get(`/search/${query}`) as any;
            setUsers(response)
        }
    }
    useEffect(() => {

        search();
    }, [query])



    return (
        <div className="search-page">

            <div className='input-field'>
                <SmallIcon icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>}/>
                <BasicInputField classname='enlarge' value={query} onChange={(event) => setQuery(event.target.value)} placeholder='search for user'/>
            </div>

            
            <Holder classname='user-display'>
            {
                    query.trim() &&
                    user.map((value, index) => <GenericHeader style={{
                        backgroundColor: "var(--color-element)",
                        borderRadius: "var(--radius-medium)",
                        padding: "var(--padding-medium)"
                    }} username={value.username} clickMode='header'
                        content='' profilePic={value.profilePicture} timestamp='' onClick={() => navigate(`/dashboard/profile?user=${value.username}-${value._id}`)} />)
                }
            </Holder>
          
        </div>
    )
}