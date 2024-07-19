import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { MdOutlineMail, MdPassword } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const SignUpPage = () => {
	const [formData, setFormData] = useState({
		email: "",
		username: "",
		fullName: "",
		password: "",
	});

	const queryClient = useQueryClient();

	const { mutate, isError, isPending, error } = useMutation({
		mutationFn: async ({ email, username, fullName, password }) => {
			try {
				const res = await fetch("/api/auth/signup", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, username, fullName, password }),
				});

				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Failed to create account");
				console.log(data);
				return data;
			} catch (error) {
				console.error(error);
				throw error;
			}
		},
		onSuccess: () => {
			toast.success("Account created successfully");
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		mutate(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<div className="max-w-6xl mx-auto flex h-screen items-center justify-center ">
			{/* Removed the left logo section */}
			<div className="flex-1 flex flex-col justify-center items-center">
				<motion.div
					initial={{ opacity: 0, y: -50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="mb-8"
				>
					<img src="abstract-logo-design-blue.png" alt="Logo" className="w-24 h-auto" />
				</motion.div>
				<motion.form
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="flex gap-4 flex-col p-8 rounded-lg shadow-lg w-full max-w-sm" // Adjusted width to match LoginPage
					onSubmit={handleSubmit}
				>
					<h1 className="text-4xl font-extrabold text-white">Join today.</h1>
					<label className="input input-bordered rounded flex items-center gap-2 mt-4">
						<MdOutlineMail className="text-white" />
						<input
							type="email"
							className="input-field"
							placeholder="Email"
							name="email"
							onChange={handleInputChange}
							value={formData.email}
						/>
					</label>
					<div className="flex gap-4 flex-wrap">
						<label className="input input-bordered rounded flex items-center gap-2 flex-1">
							<FaUser className="text-white" />
							<input
								type="text"
								className="input-field"
								placeholder="Username"
								name="username"
								onChange={handleInputChange}
								value={formData.username}
							/>
						</label>
						<label className="input input-bordered rounded flex items-center gap-2 flex-1">
							<MdDriveFileRenameOutline className="text-white" />
							<input
								type="text"
								className="input-field"
								placeholder="Full Name"
								name="fullName"
								onChange={handleInputChange}
								value={formData.fullName}
							/>
						</label>
					</div>
					<label className="input input-bordered rounded flex items-center gap-2">
						<MdPassword className="text-white" />
						<input
							type="password"
							className="input-field"
							placeholder="Password"
							name="password"
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>
					<motion.button
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						className="btn rounded-full btn-primary text-white mt-4 w-full"
					>
						{isPending ? "Loading..." : "Sign up"}
					</motion.button>
					{isError && <p className="text-red-500">{error.message}</p>}
				</motion.form>
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="flex flex-col gap-2 mt-4"
				>
					<p className="text-white text-lg">Already have an account?</p>
					<Link to="/login">
						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							className="btn rounded-full bg-white text-primary btn-outline w-full"
						>
							Sign in
						</motion.button>
					</Link>
				</motion.div>
			</div>
		</div>
	);
};

export default SignUpPage;
