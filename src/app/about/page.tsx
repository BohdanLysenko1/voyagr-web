export default function AboutPage() {
    return (
        <main className="max-w-6xl mx-auto px-6 py-12">
            <section className="bg-blue-50 p-8 rounded-lg shadow text-center">
                <h1 className="text-4xl font-bold mb-4"> About Us</h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                    Welcome to Voyagr, your trusted travel companion. Voyagr is your all-in-one travel platform, dedicated to helping users find the best flights, hotels, and packages to their dream destinations. Whether you are planning a 
                    weekend getaway or a once-in-a-lifetime adventure, we've got you covered. Voyagr is more than just a travel platform; it's a gateway to endless possibilities and unforgettable experiences. Voyagr curates offers from
                    top travel providers to help you save time and money booking your next trip.
                </p>
            </section>

            <section className="bg-blue-50 p-8 rounded-lg shadow text-center">
                <h2 className="text-3xl font-semibold mb-4 text-center">Meet the Creator</h2>
                <div className="flex justify-center">
                    <div className="bg-blue-100 p-6 rounded-lg shadow text-center hover:bg-blue-50 transition">
                        <img
                            src="/images/owner.jpg"
                            alt="Dennis Brilyak"
                            className="w-40 h-40 object-cover rounded-full mx-auto mb-4"
                        />
                        <h3 className="text-xl font-bold mb-2">Dennis Brilyak</h3>
                        <p className="text-gray-700">
                            Founder of Voyagr
                        </p>
                    </div>
                </div>
            </section>

            <section className="bg-blue-50 p-8 rounded-lg shadow text-center">
                <h2 className="text-3xl font-semibold mb-4">How It All Started</h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                The idea was born when our founder, Dennis Brilyak, found his true passion for travel.
                Whether it was exploring new cultures, trying new foods, taking in scenes of various beautiful landscapes and landmarks,
                he knew he wanted to share his expereinces with others in a more meaningful way. After countless hours of research, planning,
                and communication, the idea of Voyagr was born. The idea of a centralized hub for not only finding travel deals like cheap flights, hotels,
                or even expereinces. But to find a way to mix travel deals with community. There the full scope of Voyagr was brought to life. Using Voyagr, you
                can mix and match your own flight deals and hotel deals to create your own personalized package, or you can choose to have us make the package for you.
                Either one personally tailored to you using our very own Voyagr AI, or by choosing one of our popular premade package options. Where a full package
                deal not only includes flights and hotels, but includes a full itinerary, flights, hotel, breakfast, dinner, day-to-day activities, you name it. 
                </p>
            </section>
            <section className="bg-blue-50 p-8 rounded-lg shadow text-center">
                <h2 className="text-2xl font-bold mb-4">Start Your Journey</h2>
                <p className="text-gray-700 mb-6">
                Voyagr is here to make travel planning effortless. Explore, save, and book
                your perfect trip today.
                </p>
                <a href="/deals" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition" >Explore Deals</a>
            </section>
        </main>
    )
}