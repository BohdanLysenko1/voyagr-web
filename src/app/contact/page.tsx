export default function ContactUsPage() {
    return (
        <main className="max-w-6xl mx-auto px-6 py-12">
            <section className="bg-blue-50 p-8 rounded-lg shadow text-center">
                <h1 className="text-4xl font-bold mb-4"> Contact Us</h1>
                <p>
                    Feel free to reach out for any inconvenience you may have or to report an issue with our website.
                    <br />
                    For fastest response times, please call us directly using one of the phone numbers listed below, based on the reason 
                    for your call. Typical response times for emails may vary but usually range between 1-2 weeks.
                </p>
            </section>
            <section className="bg-blue-50 p-8 rounded-lg shadow text-left">
                <h1 className="text-xl font-bold mb-4">
                    By Phone
                </h1>
                <ol className="text-lg text-gray-600 leading-relaxed list-disc list-outside ml-6 space-y-3">
                    <li>
                        <strong>Customer Service Department:</strong> (###) ### - ####
                    </li>
                    <li>
                        <strong>IT Help Desk Department:</strong> (###) ### - ####
                    </li>
                    <li>
                        <strong>Accoutning Department:</strong> (###) ### - ####
                    </li>
                </ol>
                <br/>
                <h1 className="text-xl font-bold mb-4">
                    By Email
                </h1>
                <ol className="text-lg text-gray-600 leading-relaxed list-disc list-outside ml-6 space-y-3">
                    <li>
                        <strong>Customer Service Department:</strong> customerService@voyagr.com
                    </li>
                    <li>
                        <strong>IT Help Desk Department:</strong> itHelp@voyagr.com
                    </li>
                    <li>
                        <strong>Accounting Department:</strong> accounting@voyagr.com
                    </li>
                </ol>
            </section>
        </main>
    )
}