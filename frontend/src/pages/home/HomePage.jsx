import { useState } from "react";
import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";

const HomePage = () => {
	const [feedType, setFeedType] = useState("forYou");

	return (
		<div className='flex-[4_4_0] mr-auto border-r border-[#0F4C75] min-h-screen bg-[#1B262C]'>
			{/* Header */}
			<div className='flex w-full border-b border-[#0F4C75] bg-[#1B262C]'>
				<div
					className='flex justify-center flex-1 p-3 hover:bg-[#0F4C75] transition duration-300 cursor-pointer relative'
					onClick={() => setFeedType("forYou")}
				>
					<span className='text-[#BBE1FA]'>For you</span>
					{feedType === "forYou" && (
						<div className='absolute bottom-0 w-10 h-1 rounded-full bg-[#3282B8]'></div>
					)}
				</div>
				<div
					className='flex justify-center flex-1 p-3 hover:bg-[#0F4C75] transition duration-300 cursor-pointer relative'
					onClick={() => setFeedType("following")}
				>
					<span className='text-[#BBE1FA]'>Following</span>
					{feedType === "following" && (
						<div className='absolute bottom-0 w-10 h-1 rounded-full bg-[#3282B8]'></div>
					)}
				</div>
			</div>

			{/* CREATE POST INPUT */}
			<CreatePost />

			{/* POSTS */}
			<Posts feedType={feedType} />
		</div>
	);
};

export default HomePage;
