export default function HowItWorksPage() {
    return (
      <main className="max-w-6xl mx-auto px-6 py-12">
        <section className="bg-blue-50 p-8 rounded-lg shadow text-center">
          <h1 className="text-4xl font-bold mb-4">How It Works</h1>
  
          <p className="text-lg text-gray-600 leading-relaxed">
            We designed Voyagr to be very user friendly, whether using it to browse or to book, we promise a seamless experience.
            If you find yourself struggling to understand how it works, please review our workflow below to get a better understanding:
          </p>
  
          <div className="mt-6 text-left">
            <h1 className="font-bold text-xl">Navigation</h1>
            <ol className="list-decimal list-inside md:list-outside md:ml-6 space-y-3">
              <li>
                First, when landing on our website you will be greeted with our home page. You can navigate to the following pages using the interactive
                buttons located there: AI, Deals, Profile. Remember you can always navigate back to the home page using the icon located in the top right.
              </li>
              <li>
                Taking a look at the navigation bar at the top of the screen, you will find 5 tabs: Continents, Deals, Favorites, Reserved, and AI. 
                <ol className="list-disc list-outside ml-6 space-y-3">
                    <li>
                        In <em><strong>Continents</strong></em> you will find a drop-down menu where you can navigate between different continents to view each unique page.
                    </li>
                    <li>
                        Moving over to <em><strong>Deals</strong></em> tab, here the drop-dwon will provide you with 2 options: Deals or Search Deals. Selecting Deals will take you to our top travel
                        deals page that wil show 3 deals for flights, 3 for hotels, and 3 for packages, that are most popular at the moment. Keep in mind these will not be
                        there forever, they rotate based on popularity so be sure to book right away.
                    </li>
                    <li>
                        Next up you will find the <em><strong>Favorites</strong></em> tab, no drop-down menu here. Selecting this tab will take you straight to your Favorites page where you can find trips,
                        flight deals, hotel deals, package deals, etc that you have saved over time.
                    </li>
                    <li>
                        Now you meet the <em><strong>Reserved</strong></em> tab, here you can navigate to your reserved trips page. Located here will be booked trips, along with a calendar and "Next Up"
                        event reminder, to help keep you in the loop.
                    </li>
                    <li>
                        Last but not least, our <em><strong>AI</strong></em> tab. Which will take you directly to our AI page where you can conversate with our AI to curate a tailored package made just for you.
                    </li>
                </ol>
              </li>
              <li>
                Lastly you will find the profile icon all the way in the far top right corner of your screen. Hovering over this icon will prompt a drop-down menu with 3 options: Profile,
                My Journey, and Settings.
                <ol className="list-disc list-outside ml-6 space-y-3">
                    <li>
                        The Profile tab will take you directly to your profile where you can view your travel statistics, your posts and more related to your personal profile. Be sure to
                        set it up to keep your friends in touch.
                    </li>
                    <li>
                        Second you will find the My Journey Page. Our own personal touch, similar to a game. The more you travel, the more you explore, the more you unlock.
                        As you travel, a progress bar begins to get filled as you travel, the more you use our website to travel, the faster your progress bars will grow.
                        Unlock Voyagr status to become part of the <em><strong>Elite</strong></em>.
                    </li>
                    <li>
                        Lastly the settings tab where you can adjust your preferences and configure your website and profile to suit you.
                    </li>
                </ol>
              </li>
            </ol>
          </div>
          <div className="mt-6 text-left">
            <h1 className="font-bold text-xl">Workflow</h1>
            <ol className="list-decimal list-inside md:list-outside md:ml-6 space-y-3">
                <li>
                    To start your journey you can navigate to any of the following tabs, each one depends on what you are looking for and 
                    what details of your dream trip are already planned out: Continents, Deals, or AI. 
                </li>
                <ol className="list-disc list-outside ml-6 space-y-3">
                    <li>
                        Navigate to the <em><strong>Continents</strong></em> tab if you already have a destination in mind. Choose from the list of Continents and you will be redirected to that continents page.
                        Once you are there, you will be met with a few recommended package selections (that also change over time) for you to choose from, or you can select any of the 3 buttons: Flights, Hotels, or Packages 
                        in order to be redirected to our search deals page, with prepoluated settings for your chosen continent. There you can search through our existing deals to see what suits you best.
                    </li>
                    <li>
                        Navigate to the <em><strong>Deals</strong></em> tab if you are still browsing and are open to anything. On the Deals page you will be met with 3 recommended selections of flights, packages, and hotels based 
                        on popularity from your current fellow Voyagr's. You can select any of the browse buttons to be redirected to our search deals page where you can search for all and any type of deal that you could 
                        possibly want. Quick note, if you choose the "Browse All Hotels" button, you will be taken to the Search Deals page with the "Hotel" option pre-populated.
                    </li>
                    <li>
                        Lastly you can navigate to the <em><strong>AI</strong></em> tab if you want to take a shot at letting Voyagr AI curate a tailored deal made just for you. Provide your desired destinations, activities, food, 
                        hotels, views, etc and it will brainstorm to find and create a deal that suits exactly your needs.
                    </li>
                </ol>
            </ol>
          </div>
        </section>
      </main>
    );
  }