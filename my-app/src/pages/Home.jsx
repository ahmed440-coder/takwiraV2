import React from 'react';
import { Link } from 'react-router-dom';
import { MdSchedule } from "react-icons/md";
import { FaStar, FaStarHalfAlt, FaRegStar, FaUserCircle, FaCreditCard } from "react-icons/fa";
import { motion } from 'framer-motion';
import s1 from '../s1.jpg';
import s2 from '../s2.jpg';
import s3 from '../s3.jpg';
import s4 from '../s4.jpg';

function Home() {
  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <section
        className="relative flex items-center justify-center h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${s4})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80"></div>

        <motion.div
          className="relative z-10 text-center px-6 md:px-12 max-w-3xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Welcome to Your Ultimate Football Experience
          </h1>
          <motion.p
            className="text-lg md:text-xl text-gray-200 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Book your time slots, manage your profile, and access exclusive features.
          </motion.p>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex justify-center space-x-6"
          >
            <Link
              to="/StadiumPreview"
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              Book Now
            </Link>
            <Link
              to="/Addstadium"
              className="inline-block text-red-600 bg-white border-2 border-red-600 font-semibold py-4 px-10 rounded-full text-lg shadow-md hover:bg-red-600 hover:text-white transition duration-300 ease-in-out transform hover:scale-105"
            >
              Add Your Stadium
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800">
        <motion.div
          className="container mx-auto px-6 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-semibold text-red-500 mb-8">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[{
              icon: <MdSchedule className="mx-auto mb-4 w-16 h-16 text-red-500" />,
              title: "Real-Time Availability",
              desc: "Check live availability and easily book your preferred time slot for football matches."
            }, {
              icon: <FaUserCircle className="mx-auto mb-4 w-16 h-16 text-red-500" />,
              title: "Detailed Player Profiles",
              desc: "Track your performance with win/loss stats, favorite positions, and more to improve your game."
            }, {
              icon: <FaCreditCard className="mx-auto mb-4 w-16 h-16 text-red-500" />,
              title: "Easy Payment System",
              desc: "With our easy-to-use payment system, you can recharge credits or buy special offers in just a few clicks."
            }].map((item, idx) => (
              <motion.div
                key={idx}
                className="bg-gray-900 p-8 rounded-lg shadow-lg hover:bg-gray-700 transition duration-300 ease-in-out"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * idx, duration: 0.6 }}
                viewport={{ once: true }}
              >
                {item.icon}
                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-lg text-gray-300">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Image Gallery with Fade In */}
      <section className="py-20 bg-black">
        <motion.div
          className="container mx-auto px-6 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-semibold text-red-500 mb-8">Experience the Stadium</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[s1, s2, s3].map((src, idx) => (
              <motion.img
                key={idx}
                src={src}
                alt={`Stadium Image ${idx + 1}`}
                className="w-full h-60 object-cover rounded-lg shadow-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 * idx }}
                viewport={{ once: true }}
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold text-red-500 mb-14"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            What Players Are Saying
          </motion.h2>

          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {[ 
              {
                text: "The booking system is so easy, and I love that I can see live availability!",
                rating: [<FaStar />, <FaStar />, <FaStar />, <FaStarHalfAlt />, <FaRegStar />],
                user: "Ahmed R."
              },
              {
                text: "I love checking my stats. It motivates me to play better every day!",
                rating: [<FaStar />, <FaStar />, <FaStar />, <FaStar />, <FaStar />],
                user: "Sarah K."
              },
              {
                text: "Super convenient! I can plan my games with friends without calling anyone.",
                rating: [<FaStar />, <FaStar />, <FaStar />, <FaStar />, <FaRegStar />],
                user: "Youssef M."
              },
              {
                text: "Clean interface, easy to book, and great customer support.",
                rating: [<FaStar />, <FaStar />, <FaStar />, <FaStarHalfAlt />, <FaRegStar />],
                user: "Leila B."
              },
              {
                text: "Nice app but I wish there were more time slots in the evening.",
                rating: [<FaStar />, <FaStar />, <FaStar />, <FaRegStar />, <FaRegStar />],
                user: "Mohamed T."
              },
              {
                text: "Love it! Been playing here every week.",
                rating: [<FaStar />, <FaStar />, <FaStar />, <FaStar />, <FaStar />],
                user: "Khaled D."
              }
            ].map((review, index) => (
              <motion.div
                key={index}
                className="bg-gray-800 p-6 md:p-8 rounded-2xl shadow-md hover:shadow-red-500/30 transition-all duration-300 transform hover:-translate-y-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                viewport={{ once: true }}
              >
                <p className="text-gray-300 text-base md:text-lg mb-4">"{review.text}"</p>
                <div className="flex justify-center mb-2 text-red-500 text-xl space-x-1">
                  {review.rating.map((icon, i) => (
                    <span key={i}>{icon}</span>
                  ))}
                </div>
                <h4 className="text-white font-semibold text-lg">{review.user}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        className="bg-gradient-to-r from-red-500 to-black text-white py-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-4">Ready to Play?</h2>
          <p className="text-lg mb-8">
            Join us today and start booking your matches instantly.
          </p>
          <Link
            to="/booking"
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-4 px-10 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
          >
            Book Now
          </Link>
        </div>
      </motion.section>
    </div>
  );
}

export default Home;
