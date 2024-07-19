import XSvg from "../svgs/X";
import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const Sidebar = () => {
	const queryClient = useQueryClient();
	const { mutate: logout } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("/api/auth/logout", {
					method: "POST",
				});
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		onError: () => {
			toast.error("Logout failed");
		},
	});
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });

	return (
		<motion.div
			className='md:flex-[2_2_0] w-16 sm:w-12 max-w-52'
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.3 }}
		>
			<motion.div
				className='sticky top-0 left-0 h-screen flex flex-col border-r border-[#3572EF] bg-[#050C9C]'
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.3 }}
			>
				<ul className='flex flex-col gap-3 mt-4'>
					<motion.li
						className='flex justify-center md:justify-start'
						whileHover={{ scale: 1.05 }}
					>
						<Link
							to='/'
							className='flex gap-2 items-center hover:bg-[#3ABEF9] transition-all rounded-full duration-300 py-2 px-2 max-w-fit cursor-pointer'
						>
							<MdHomeFilled className='w-6 h-6 text-[#A7E6FF]' />
							<span className='text-md hidden md:block text-[#A7E6FF]'>Home</span>
						</Link>
					</motion.li>
					<motion.li
						className='flex justify-center md:justify-start'
						whileHover={{ scale: 1.05 }}
					>
						<Link
							to='/notifications'
							className='flex gap-2 items-center hover:bg-[#3ABEF9] transition-all rounded-full duration-300 py-2 px-2 max-w-fit cursor-pointer'
						>
							<IoNotifications className='w-6 h-6 text-[#A7E6FF]' />
							<span className='text-md hidden md:block text-[#A7E6FF]'>Notifications</span>
						</Link>
					</motion.li>
					<motion.li
						className='flex justify-center md:justify-start'
						whileHover={{ scale: 1.05 }}
					>
						<Link
							to={`/profile/${authUser?.username}`}
							className='flex gap-2 items-center hover:bg-[#3ABEF9] transition-all rounded-full duration-300 py-2 px-2 max-w-fit cursor-pointer'
						>
							<FaUser className='w-6 h-6 text-[#A7E6FF]' />
							<span className='text-md hidden md:block text-[#A7E6FF]'>Profile</span>
						</Link>
					</motion.li>
				</ul>
				{authUser && (
					<motion.div
						className='mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#3ABEF9] py-2 px-2 rounded-full'
						whileHover={{ scale: 1.05 }}
					>
						<Link
							to={`/profile/${authUser.username}`}
							className='flex items-center'
						>
							<div className='avatar hidden md:inline-flex'>
								<div className='w-8 rounded-full'>
									<img src={authUser?.profileImg || "/avatar-placeholder.png"} alt="Profile" />
								</div>
							</div>
							<div className='flex justify-between flex-1 ml-2'>
								<div className='hidden md:block'>
									<p className='text-[#A7E6FF] font-bold text-sm w-20 truncate'>{authUser?.fullName}</p>
									<p className='text-[#A7E6FF] text-sm'>@{authUser?.username}</p>
								</div>
							</div>
						</Link>
						<BiLogOut
							className='w-5 h-5 cursor-pointer text-[#A7E6FF]'
							onClick={(e) => {
								e.preventDefault();
								logout();
							}}
						/>
					</motion.div>
				)}
			</motion.div>
		</motion.div>
	);
};

export default Sidebar;
