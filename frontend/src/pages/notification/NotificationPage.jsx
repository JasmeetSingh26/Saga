import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser, FaHeart } from "react-icons/fa";

const NotificationPage = () => {
	const queryClient = useQueryClient();
	const { data: notifications, isLoading } = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/notifications");
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Something went wrong");
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
	});

	const { mutate: deleteNotifications } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("/api/notifications", {
					method: "DELETE",
				});
				const data = await res.json();

				if (!res.ok) throw new Error(data.error || "Something went wrong");
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("Notifications deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return (
		<div className='flex-[4_4_0] border-l border-r border-[#1B262C] min-h-screen bg-[#1B262C]'>
			<div className='flex justify-between items-center p-4 border-b border-[#0F4C75]'>
				<p className='font-bold text-[#BBE1FA]'>Notifications</p>
				<div className='dropdown'>
					<div tabIndex={0} role='button' className='m-1'>
						<IoSettingsOutline className='w-4 text-[#BBE1FA]' />
					</div>
					<ul
						tabIndex={0}
						className='dropdown-content z-[1] menu p-2 shadow bg-[#0F4C75] rounded-box w-52'
					>
						<li>
							<a onClick={deleteNotifications} className='text-[#BBE1FA] hover:text-white'>Delete all notifications</a>
						</li>
					</ul>
				</div>
			</div>
			{isLoading && (
				<div className='flex justify-center h-full items-center'>
					<LoadingSpinner size='lg' />
				</div>
			)}
			{notifications?.length === 0 && <div className='text-center p-4 font-bold text-[#BBE1FA]'>No notifications 🤔</div>}
			{notifications?.map((notification) => (
				<div className='border-b border-[#0F4C75]' key={notification._id}>
					<div className='flex gap-2 p-4'>
						{notification.type === "follow" && <FaUser className='w-7 h-7 text-[#3282B8]' />}
						{notification.type === "like" && <FaHeart className='w-7 h-7 text-[#FF6969]' />}
						<Link to={`/profile/${notification.from.username}`}>
							<div className='avatar'>
								<div className='w-8 rounded-full border border-[#1B262C]'>
									<img src={notification.from.profileImg || "/avatar-placeholder.png"} alt="Profile" />
								</div>
							</div>
							<div className='flex gap-1'>
								<span className='font-bold text-[#BBE1FA]'>@{notification.from.username}</span>{" "}
								{notification.type === "follow" ? "followed you" : "liked your post"}
							</div>
						</Link>
					</div>
				</div>
			))}
		</div>
	);
};

export default NotificationPage;
