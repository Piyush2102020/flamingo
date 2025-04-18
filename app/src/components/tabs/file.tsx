import { useEffect, useState } from "react";
import { Holder } from "../../newComponents/Generics/GenericHolders/file";
import { GenericHeader } from "../../newComponents/Generics/GenericHeader/file";
import axiosInstance from "../../helpers/axiosModified";
import { useNavigate, useParams } from "react-router-dom";
import { BasicButton } from "../../newComponents/Clickables/buttons/file";
import { useSelector } from "react-redux";
import { RootState } from "../../helpers/store";

export default function FollowersTab() {
  const params = useParams();
  const navigate=useNavigate();
  const userId = params.id;
  const context=useSelector((state:RootState)=>state.context);
  const [tab, setTab] = useState(params.type);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showButton,setShowButton]=useState(true);


  const HandleUnfollow=(id:string)=>{
    setShowButton(!showButton)
    axiosInstance.put(`/profile/${id}?action=unfollow`)
  }


  const removeFollower=(id:string)=>{
    setShowButton(!showButton)
    axiosInstance.put(`/profile/${id}?action=removeFollower`)
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/profile/${userId}?type=${tab}`) as any;
      setItems(res);
        
      } catch (error) {
        console.error("Error fetching followers/following", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tab, userId]);

  return (
    <Holder>
      <Holder direction="horizontal" classname="tabs">
        <p onClick={() => setTab("followers")} className={`tab-item ${tab=='followers'?"selected":""}`}>
          Followers
        </p>
        <p onClick={() => setTab("following")} className={`tab-item ${tab=='following'?"selected":""}`}>
          Following
        </p>
      </Holder>

      <Holder style={{padding:"var(--padding-medium)"}}>
        {loading ? (
          <p>Loading...</p>
        ) : items.length === 0 ? (
          <p>No {tab} found.</p>
        ) : (
          items.map((value, index) => (
            <GenericHeader
              key={index}
              headText={value.username}
              hintText={value.name}
              imagePath={value.profilePicture}
              decorate={false}
              showIcon={false}
              clickType="text"
              onClick={()=>navigate(`/dashboard/profile?user=${value.username}-${value._id}`)}
              style={{ width: "100%", padding: "0.5rem 0" }}
            >

                {showButton &&userId===context.userData._id  &&<BasicButton style={{backgroundColor:"var(--color-shadow)"}} onClick={tab=='following'?()=>HandleUnfollow(value._id):()=>removeFollower(value._id)} text={tab=='followers'?"Remove Follower":"Unfollow"}/>
           }
                 </GenericHeader>
          ))
        )}
      </Holder>
    </Holder>
  );
}
