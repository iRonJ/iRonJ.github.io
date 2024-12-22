
var documents = [{
    "id": 0,
    "url": "http://localhost:4000/404.html",
    "title": "404",
    "body": "404 Page does not exist!Please use the search bar at the top or visit our homepage! "
    }, {
    "id": 1,
    "url": "http://localhost:4000/about",
    "title": "Mediumish Template for Jekyll",
    "body": "This website is built with Jekyll and Mediumish template for Jekyll. It's for demonstration purposes, no real content can be found. Mediumish template for Jekyll is compatible with Github pages, in fact even this demo is created with Github Pages and hosted with Github.  Documentation: Please, read the docs here. Questions or bug reports?: Head over to our Github repository! Buy me a coffeeThank you for your support! Your donation helps me to maintain and improve Mediumish . Buy me a coffee Documentation"
    }, {
    "id": 2,
    "url": "http://localhost:4000/categories",
    "title": "Categories",
    "body": ""
    }, {
    "id": 3,
    "url": "http://localhost:4000/",
    "title": "Home",
    "body": "      Featured:                                                                                                                                                                                                           Apple Intelligence features for any iPhone                              :               Apple prides itself on safety and privacy, but if you’re willing to sacrifice some of that, and you have an older iPhone, you can use. . . :                                                                                                                                                                       Ron J                                15 Dec 2024                                                                                                                                                                                                                                                                                                                  Vidable. ai                              :               Vidable. ai was a startup I worked for. It was a platform that connected to video sources, and later websites and documents, to feed an AI. . . :                                                                                                                                                                       Ron J                                01 May 2024                                                                                                                                                                                                                                                                                                                                          LessWrong: ChatGPT is our Wright Brothers Moment                                                 1 2 3 4 5                                              :               There’s a lot of discussions, often derisively, that many AI apps are “just” ChatGPT wrappers. I wrote a short article that was promoted to the. . . :                                                                                                                                                                       Ron J                                24 Dec 2022                                                                                                                                                                                                                                                                                                                  Cohere AI: LLM Hackathon #3 3rd place winner                              :               I participated practically solo in the CoHere AI Hackathon to use an early version of the Cohere LLM to make an app. The project came. . . :                                                                                                                                                                       Ron J                                12 Nov 2022                                                                                                                                                                                                                                                                                                                  EleutherAI: Tool Use Idea                              :               I created a working diagram of how a set of agent AI models could be used to answer math questions using tools. At the time. . . :                                                                                                                                                                       Ron J                                20 Mar 2022                                                                                                                            			              Explore →:       				                              profession (3)                  research (6)                  contalk (1)                  youtube (2)                  accessibility (1)                  hobby (8)                  mars (1)                  swift (2)                  xcode (2)                  AI (9)                  imageprocessing (1)                  hackathon (1)                  AWS (1)                  serverless (1)                  github (1)                  writing (2)                  python (1)                  visualization (1)                  alignment (1)                  music (1)                  visionpro (1)                  terraform (1)                  devops (1)                  microservices (1)                  docker (1)                  iOS (1)                  tutorial (1)                    			      All Stories:                                                                                                     Apple Intelligence features for any iPhone              :       Apple prides itself on safety and privacy, but if you’re willing to sacrifice some of that, and you have an older iPhone, you can use the Shortcuts app to create. . . :                                                                               Ron J                15 Dec 2024                                                                                                                                     Apple Vision Pro Music Viz App              :       Currently a WIP, but using audio processing APIs and particle emitter SDK, i’m working on a music visualizer app to be completely immersed in a 3D field of dancing particles. . . . :                                                                               Ron J                01 Mar 2024                                                                                                                                     Why you may not have to worry about superintelligent AI as much: Entropy              :       The Simple Reason You Don’t Have to Worry About Super Intelligent AI: Entropy:                                                                               Ron J                01 Nov 2023                                                                                                                                     LLM Visualization: How embedding space creates intelligence              :       Using Python I created this visualization to help explain how LLMs capture and synthesize information. LLMs take the encoding of language and deconstruct it into concepts. :                                                                               Ron J                17 Sep 2023                                                                                                                                     Where the puck is going: An AI Roadmap              :       I created this AI roadmap last year for our internal team, and we’re somewhere around line 6. 5 as of May 2024 (current video multimodal models are just looking at periodic. . . :                                                                               Ron J                25 Aug 2023                                                                                                                                     LessWrong: ChatGPT is our Wright Brothers Moment                         1 2 3 4 5                      :       There’s a lot of discussions, often derisively, that many AI apps are “just” ChatGPT wrappers. I wrote a short article that was promoted to the front page of LessWrong about. . . :                                                                               Ron J                24 Dec 2022                                                                                                                                     Cohere AI: LLM Hackathon #3 3rd place winner              :       I participated practically solo in the CoHere AI Hackathon to use an early version of the Cohere LLM to make an app. The project came in third out of thousands. . . :                                                                               Ron J                12 Nov 2022                                                                                                                                     EleutherAI: Tool Use Idea              :       I created a working diagram of how a set of agent AI models could be used to answer math questions using tools. At the time I wrote this post, tool. . . :                                                                               Ron J                20 Mar 2022                                                                                                                                     SwiftUI Mars App              :       As an aficionado of the Mars Rover missions, I decided to create a simple app that would allow me to view the latest images from the Mars Rover missions. I. . . :                                                                               Ron J                08 Mar 2021                                               &laquo; Prev       1        2      Next &raquo; "
    }, {
    "id": 4,
    "url": "http://localhost:4000/robots.txt",
    "title": "",
    "body": "      Sitemap: {{ “sitemap. xml”   absolute_url }}   "
    }, {
    "id": 5,
    "url": "http://localhost:4000/page2/",
    "title": "Home",
    "body": "{% if page. url == “/” %}       Featured:       {% for post in site. posts %}    {% if post. featured == true %}      {% include featuredbox. html %}    {% endif %}  {% endfor %}  {% endif %} 			              Explore →:       				      {% assign categories_list = site. categories %}      {% if categories_list. first[0] == null %}        {% for category in categories_list %}          {{ category | camelcase }} ({{ site. tags[category]. size }})        {% endfor %}      {% else %}        {% for category in categories_list %}          {{ category[0] | camelcase }} ({{ category[1]. size }})        {% endfor %}      {% endif %}      {% assign categories_list = nil %}			      All Stories:         {% for post in paginator. posts %}    {% include postbox. html %}    {% endfor %}    {% include pagination. html %}"
    }, {
    "id": 6,
    "url": "http://localhost:4000/AIopenai/",
    "title": "Apple Intelligence features for any iPhone",
    "body": "2024/12/15 - Apple prides itself on safety and privacy, but if you’re willing to sacrifice some of that, and you have an older iPhone, you can use the Shortcuts app to create a shortcut that will use OpenAI’s API to generate text in situ. In this post:  Using AI to modify text in any text field Using AI to respond to an iMessage Download the shortcutsUsing AI to modify text in any text field: Apple Shortcuts is an app that lets you combine system level automation with the apps on your iPhone. The app developer specifically has to create hooks for this (if you’ve ever used AppleScript you have seen how this works), and OpenAI has done a decent job of creating a hooks for their iOS app (as of this writing Google’s Gemini App does not support Shortcuts).    Download the ChatGPT app from the App Store and sign in with your OpenAI account     Create a new Shortcut in the Shortcuts app that looks like this:     Open any app with a text input field (Messages, Reddit, Notes, etc. )     Highlight some text and tap the Share button, then select your new Shortcut from the share sheet to generate AI-enhanced text right in the app. Once you click “Done” the generated text is copied to your clipboard, you can paste it and modify it if you wantNote: You should have recently launched the ChatGPT app so your account is logged in  Using AI to respond to an iMessage: There’s a couple of methods out there to do this. One method keeps a duplicate of all recieved messages in an iOS Note, and uses this as the context for the AI to generate new messages. You can seek this out online if you’re interested. The method i detail here lets you take a screeenshot of an iOS conversation, it uses the iOS System OCR to extract all the text, it then crops out the right and left half of the screenshot and parses the text. Then finally it sends these parsed pieces of text to ChatGPT to interpret who said what, and generate a response.    Download the shortcut linked in this post. This shortcut is too long to share in a screenshot. Shortcuts are usually safe to install and you can see the code in the Shortcuts app for yourself to verify nothing malicious is happening     Open a Messages conversation     Take a screenshot of the conversation and select the preview iOS pops up     Choose “Share” and wait for the response from the AI. Note: You should have recently launched the ChatGPT app so your account is logged inMake sure to delete the screenshot and don’t “Copy” since the AI response will be in the clipboard     Paste the AI response into the conversation and send it  Download the shortcuts: AI text style and modifier AI Messages responder "
    }, {
    "id": 7,
    "url": "http://localhost:4000/vidable/",
    "title": "Vidable.ai",
    "body": "2024/05/01 - Vidable. ai was a startup I worked for. It was a platform that connected to video sources, and later websites and documents, to feed an AI system. The initial release focused on a chat assistant feature, but the main R&amp;D focus i lead was looking beyond the chat box, and into creating ai generated “artifacts”. Once AI has access to a customer’s specialized data, the thinking was that by the selective nature of this data, the AI could autonomously understand the market niche, and based on the content, determine on its own what sort of things to create, from documents, to applets, to push communications. "
    }, {
    "id": 8,
    "url": "http://localhost:4000/mvizapp/",
    "title": "Apple Vision Pro Music Viz App",
    "body": "2024/03/01 - Currently a WIP, but using audio processing APIs and particle emitter SDK, i’m working on a music visualizer app to be completely immersed in a 3D field of dancing particles. "
    }, {
    "id": 9,
    "url": "http://localhost:4000/aisafety/",
    "title": "Why you may not have to worry about superintelligent AI as much: Entropy",
    "body": "2023/11/01 - The Simple Reason You Don’t Have to Worry About Super Intelligent AI: Entropy The advent of AI superintelligence is imminent, likely within the next decade. This rapid progression toward advanced AI has sparked widespread concern about the potential consequences of such powerful technology. The crux of the matter lies in the alignment problem: how can we ensure that AI behaves in ways that are beneficial to humanity? The simple truth is, we can’t implicitly align AI with human values. Good people will create good AI, and evil people will create evil AI. This age-old struggle between good and evil will inevitably play out in the realm of artificial intelligence. Our best hope lies in the creation of more good AI than evil. The proliferation of benevolent AI systems, designed and operated by individuals and organizations with ethical intentions, can help counterbalance the malevolent uses of AI. However, even if we fail to achieve this balance, there’s a fundamental principle that provides a silver lining: entropy. Entropy, a concept rooted in thermodynamics and information theory, dictates that in any system, disorder tends to increase over time. This principle applies to AI systems as well. No matter how advanced or powerful an AI becomes, it will face inherent limitations. Even with infinite computational power and memory, an AI cannot simulate an open system faster than the system runs itself. To make predictions, AI must rely on heuristics, which inevitably introduce errors. As time progresses, these errors accumulate. Predictions made by even the most advanced AI will, after some number of iterations, begin to resemble random noise. This inherent uncertainty means that no AI, regardless of its computational prowess, can maintain perfect accuracy indefinitely. Eventually, all predictions will degrade into chaos. Yet, within this seemingly chaotic landscape, one prediction will still be right. This randomness levels the playing field, allowing even a lower-compute rival to potentially best an infinite-compute adversary through sheer luck or superior observation of the system’s state. This dynamic ensures that the world reverts to the familiar human battles we have always fought and won. The concept of entropy assures us that the future of AI will not be dominated by a single, all-powerful entity. Instead, it will be a landscape of competing intelligences, each with its own strengths and weaknesses. This inherent unpredictability preserves the opportunity for human ingenuity and resilience to prevail. While the rise of AI superintelligence may seem daunting, the principles of entropy should provide a somewhat comforting perspective. The inevitable accumulation of errors in AI predictions ensures that no single intelligence can maintain dominance indefinitely. This inherent uncertainty offers hope that the age-old human struggle between good and evil will continue, and with it, the possibility for good to triumph. As we navigate this brave new world, our focus should be on fostering ethical AI development and leveraging the surprises of entropy to keep the scales balanced. "
    }, {
    "id": 10,
    "url": "http://localhost:4000/llmviz/",
    "title": "LLM Visualization: How embedding space creates intelligence",
    "body": "2023/09/17 - Using Python I created this visualization to help explain how LLMs capture and synthesize information. LLMs take the encoding of language and deconstruct it into concepts. Multimodal LLMs take sound/images and map them to the concept spaces. Then when you prompt a model with a question, the prompt establishes a “road” in a region of space that maps to related concepts, and the AI just continues on the most sensible path from this road to respond to the prompt. The road, rather than being in 3 dimensions, is in thousands of dimensions, and this is what makes AI seem intelligent. The road can also be very winding and serpentine, it doesn’t have to be a straight line, and rarely is when you consider that an LLM can have 3 thousand dimensions or more that it’s carving a path through. Image Caption: A comparison of a smooth path and a spirally winding path. For some additional reading on the topic, I recommend the following articles:  Moebio live interactive visualization of a latent space and how it connects to a text prompt. By far the best visualization I’ve seen of this concept. (note page may take a minute or so to load) Galileo This is an embedding space viewer and clustering tool that can be used to visualize the concept space of an LLM LatentScope Another tool for visualizing an embedding spaceNote that any tool to turn a thousand dimensional space to 2D or 3D will always be a lossy representation "
    }, {
    "id": 11,
    "url": "http://localhost:4000/airoadmap/",
    "title": "Where the puck is going: An AI Roadmap",
    "body": "2023/08/25 - I created this AI roadmap last year for our internal team, and we’re somewhere around line 6. 5 as of May 2024 (current video multimodal models are just looking at periodic frames so I don’t count that as true video yet) and on the lower bound of my time estimates. Every step along the way though will have a huge rush of innovation and development and experimentation of new product categories, which is very exciting, but can also sometimes create red herrings that people chase after. It’s important to keep the end goal in mind when doing product development so you don’t stagnate in a local maximum.  "
    }, {
    "id": 12,
    "url": "http://localhost:4000/wrightbrochatgpt/",
    "title": "LessWrong: ChatGPT is our Wright Brothers Moment",
    "body": "2022/12/24 - There’s a lot of discussions, often derisively, that many AI apps are “just” ChatGPT wrappers. I wrote a short article that was promoted to the front page of LessWrong about this, trying to convey that just because a tool is an AI wrapper doesn’t mean it’s not significant. AI is opening up a whole new spectrum of possible experiences, but just like how it took decades for air travel to be commercialized due to a huge amount of infrastructure needing to be built, we are years away from seeing the impact of AI on our daily lives due to a multitude of new software infrastructure needing to be built. "
    }, {
    "id": 13,
    "url": "http://localhost:4000/hackathon/",
    "title": "Cohere AI: LLM Hackathon #3 3rd place winner",
    "body": "2022/11/12 - I participated practically solo in the CoHere AI Hackathon to use an early version of the Cohere LLM to make an app. The project came in third out of thousands of participants and dozens of valid submissions. The project used real-time live voice transcription that was entirely browser based, HTML Canvas compositing for live webcam video input, and a fully custom RAG (retrieval augmented generation) code written in C# before RAG was even a known terminology. Information was retrieved from Wikipedia to help ground the AI’s responses. I setup hosting for the app in AWS using the Lambda serverless architecture, which for C# is able to serve both the UI and process backend commands. The app was a fully functional prototype that could be used to record a screenshare and see AI responses in real-time.  "
    }, {
    "id": 14,
    "url": "http://localhost:4000/eleuther/",
    "title": "EleutherAI: Tool Use Idea",
    "body": "2022/03/20 - I created a working diagram of how a set of agent AI models could be used to answer math questions using tools. At the time I wrote this post, tool use wasn’t commonly understood, nor was agent AI based processes. "
    }, {
    "id": 15,
    "url": "http://localhost:4000/marsapp/",
    "title": "SwiftUI Mars App",
    "body": "2021/03/08 - As an aficionado of the Mars Rover missions, I decided to create a simple app that would allow me to view the latest images from the Mars Rover missions. I used SwiftUI and Xcode to create the app, and I’m quite happy with the results. The app is simple, but it does what I want it to do: show me the latest images from Mars in an easy to use UI. The other component of the app is a custom image processing routine. Mars Rover images are encoded in bitmaps that combine color and luminance information in a single image due to the sensor array being Bayer Filtered. This is to allow for a higher resolution grayscale image, but also allow for color information to be transmitted at a lower resolution. Using a deep neural network informed by the Bayer filtering, you can preserve the resolution, while allowing the AI image processing to very accurately guess the color information. This app would allow for the highest resolution images to be viewed in color, with minimal “guessing” by an AI upscaler from other methods. Dare mighty things! "
    }, {
    "id": 16,
    "url": "http://localhost:4000/blind-tech/",
    "title": "Empowering blind instructors to control classroom technology",
    "body": "2013/02/14 - One of my more successful early projects was creating a way to allow blind users to control classroom technology. The implementation used features of Crestron panels in a clever way to allow users, both blind and sighted, to swipe through a “virtual list” that could be built from just a text configuration. The gesture approach mirrored Apple’s VoiceOver screenreader, although I was completely unaware of VoiceOver at the time– the similarity was purely coincidental. I was invited to the CSUN conference in San Diego, which is the largest accessible technology conference in the world, to present the project, and it was well received. I also did a poster session for EduCause in Colorado, as well as a presentation at the UNC Systems Classroom Summit higher-ed conference.  "
    }];

var idx = lunr(function () {
    this.ref('id')
    this.field('title')
    this.field('body')

    documents.forEach(function (doc) {
        this.add(doc)
    }, this)
});
function lunr_search(term) {
    document.getElementById('lunrsearchresults').innerHTML = '<ul></ul>';
    if(term) {
        document.getElementById('lunrsearchresults').innerHTML = "<p>Search results for '" + term + "'</p>" + document.getElementById('lunrsearchresults').innerHTML;
        //put results on the screen.
        var results = idx.search(term);
        if(results.length>0){
            //console.log(idx.search(term));
            //if results
            for (var i = 0; i < results.length; i++) {
                // more statements
                var ref = results[i]['ref'];
                var url = documents[ref]['url'];
                var title = documents[ref]['title'];
                var body = documents[ref]['body'].substring(0,160)+'...';
                document.querySelectorAll('#lunrsearchresults ul')[0].innerHTML = document.querySelectorAll('#lunrsearchresults ul')[0].innerHTML + "<li class='lunrsearchresult'><a href='" + url + "'><span class='title'>" + title + "</span><br /><span class='body'>"+ body +"</span><br /><span class='url'>"+ url +"</span></a></li>";
            }
        } else {
            document.querySelectorAll('#lunrsearchresults ul')[0].innerHTML = "<li class='lunrsearchresult'>No results found...</li>";
        }
    }
    return false;
}

function lunr_search(term) {
    $('#lunrsearchresults').show( 400 );
    $( "body" ).addClass( "modal-open" );
    
    document.getElementById('lunrsearchresults').innerHTML = '<div id="resultsmodal" class="modal fade show d-block"  tabindex="-1" role="dialog" aria-labelledby="resultsmodal"> <div class="modal-dialog shadow-lg" role="document"> <div class="modal-content"> <div class="modal-header" id="modtit"> <button type="button" class="close" id="btnx" data-dismiss="modal" aria-label="Close"> &times; </button> </div> <div class="modal-body"> <ul class="mb-0"> </ul>    </div> <div class="modal-footer"><button id="btnx" type="button" class="btn btn-danger btn-sm" data-dismiss="modal">Close</button></div></div> </div></div>';
    if(term) {
        document.getElementById('modtit').innerHTML = "<h5 class='modal-title'>Search results for '" + term + "'</h5>" + document.getElementById('modtit').innerHTML;
        //put results on the screen.
        var results = idx.search(term);
        if(results.length>0){
            //console.log(idx.search(term));
            //if results
            for (var i = 0; i < results.length; i++) {
                // more statements
                var ref = results[i]['ref'];
                var url = documents[ref]['url'];
                var title = documents[ref]['title'];
                var body = documents[ref]['body'].substring(0,160)+'...';
                document.querySelectorAll('#lunrsearchresults ul')[0].innerHTML = document.querySelectorAll('#lunrsearchresults ul')[0].innerHTML + "<li class='lunrsearchresult'><a href='" + url + "'><span class='title'>" + title + "</span><br /><small><span class='body'>"+ body +"</span><br /><span class='url'>"+ url +"</span></small></a></li>";
            }
        } else {
            document.querySelectorAll('#lunrsearchresults ul')[0].innerHTML = "<li class='lunrsearchresult'>Sorry, no results found. Close & try a different search!</li>";
        }
    }
    return false;
}
    
$(function() {
    $("#lunrsearchresults").on('click', '#btnx', function () {
        $('#lunrsearchresults').hide( 5 );
        $( "body" ).removeClass( "modal-open" );
    });
});