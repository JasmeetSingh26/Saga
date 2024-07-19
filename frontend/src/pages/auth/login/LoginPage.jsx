import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import XSvg from "../../../components/svgs/X";
import { MdOutlineMail, MdPassword } from "react-icons/md";

import { useMutation, useQueryClient } from "@tanstack/react-query";

const LoginPage = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});
	const queryClient = useQueryClient();

	const {
		mutate: loginMutation,
		isPending,
		isError,
		error,
	} = useMutation({
		mutationFn: async ({ username, password }) => {
			try {
				const res = await fetch("/api/auth/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ username, password }),
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
			// refetch the authUser
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		loginMutation(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<div className="max-w-6xl mx-auto flex h-screen items-center justify-center ">
			<div className="flex-1 hidden lg:flex items-center justify-center">
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 1 }}
					className="lg:w-2/3 fill-white"
				>

				</motion.div>
			</div>
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
					className="flex gap-4 flex-col p-8 rounded-lg shadow-lg"
					onSubmit={handleSubmit}
				>

					<h1 className="text-4xl font-extrabold text-white">{"Let's"} go.</h1>
					<label className="input input-bordered rounded flex items-center gap-2 mt-4">
						<MdOutlineMail className="text-white" />
						<input
							type="text"
							className="input-field"
							placeholder="Username"
							name="username"
							onChange={handleInputChange}
							value={formData.username}
						/>
					</label>

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
						{isPending ? "Loading..." : "Login"}
					</motion.button>
					{isError && <p className="text-red-500">{error.message}</p>}
				</motion.form>
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="flex flex-col gap-2 mt-4"
				>
					<p className="text-white text-lg">{"Don't"} have an account?</p>
					<Link to="/signup">
						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							className="btn rounded-full bg-white text-primary btn-outline w-full"
						>
							Sign up
						</motion.button>
					</Link>
				</motion.div>
			</div>
		</div>
	);
};

export default LoginPage;
