import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const CreatePost = () => {
	const [text, setText] = useState("");
	const [img, setImg] = useState(null);
	const imgRef = useRef(null);

	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const queryClient = useQueryClient();

	const {
		mutate: createPost,
		isPending,
		isError,
		error,
	} = useMutation({
		mutationFn: async ({ text, img }) => {
			try {
				const res = await fetch("/api/posts/create", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ text, img }),
				});
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},

		onSuccess: () => {
			setText("");
			setImg(null);
			toast.success("Post created successfully");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		createPost({ text, img });
	};

	const handleImgChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className='flex p-4 items-start gap-4 border-b border-[#0F4C75] bg-[#1B262C]'>
			<div className='avatar'>
				<div className='w-10 rounded-full'>
					<img src={authUser?.profileImg || "/avatar-placeholder.png"} alt="Profile" />
				</div>
			</div>
			<form className='flex flex-col gap-2 w-full' onSubmit={handleSubmit}>
				<textarea
					className='textarea w-full p-2 text-lg resize-none border border-[#3282B8] rounded-md focus:outline-none bg-[#1B262C] text-[#BBE1FA]'
					placeholder='What is happening?!'
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
				{img && (
					<div className='relative w-full max-w-md mx-auto'>
						<IoCloseSharp
							className='absolute top-1 right-1 text-[#1B262C] bg-[#BBE1FA] rounded-full w-6 h-6 flex items-center justify-center cursor-pointer'
							onClick={() => {
								setImg(null);
								imgRef.current.value = null;
							}}
						/>
						<img src={img} className='w-full h-72 object-contain rounded-md border border-[#3282B8]' alt="Preview" />
					</div>
				)}
				<div className='flex justify-between border-t py-2 border-t-[#3282B8]'>
					<div className='flex gap-2 items-center'>
						<CiImageOn
							className='text-[#BBE1FA] w-6 h-6 cursor-pointer hover:text-[#3282B8]'
							onClick={() => imgRef.current.click()}
						/>
						<BsEmojiSmileFill className='text-[#BBE1FA] w-5 h-5 cursor-pointer hover:text-[#3282B8]' />
					</div>
					<input type='file' accept='image/*' hidden ref={imgRef} onChange={handleImgChange} />
					<button className='bg-[#3282B8] text-white rounded-full py-2 px-4 text-sm font-semibold hover:bg-[#0F4C75]'>
						{isPending ? "Posting..." : "Post"}
					</button>
				</div>
				{isError && <div className='text-red-500 mt-2'>{error.message}</div>}
			</form>
		</div>
	);
};

export default CreatePost;
