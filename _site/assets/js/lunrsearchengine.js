
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
    "body": "      Featured:                                                                                                                                                                                                           Vidable. ai                              :               Vidable. ai was a project I worked on during my time at Vidable. It was a platform that was designed to connect to video sources, and. . . :                                                                                                                                                                       Ron J                                01 May 2024                                                                                                                                                                                                                                                                                                                        LessWrong: ChatGPT is our Wright Brothers Moment                                                 1 2 3 4 5                                              :               There’s a lot of discussions, often derisively, that many AI apps are “just” ChatGPT wrappers. I wrote a short article that was promoted to the. . . :                                                                                                                                                                       Ron J                                24 Dec 2022                                                                                                                                                                                                                                                                                                                  Cohere AI: LLM Hackathon #3 3rd place winner                              :               I participated practically solo in the CoHere AI Hackathon to use an early version of the Cohere LLM to make an app. The project came. . . :                                                                                                                                                                       Ron J                                12 Nov 2022                                                                                                                                                                                                                                                                                                                  EleutherAI: Tool Use Idea                              :               I created a working diagram of how a set of agent AI models could be used to answer math questions using tools. At the time. . . :                                                                                                                                                                       Ron J                                20 Mar 2022                                                                                                                                  All Stories:                                                                                                     Apple Vision Pro Music Viz App              :       Currently a WIP, but using audio processing APIs and particle emitter SDK, i’m working on a music visualizer app to be completely immersed in a 3D field of dancing particles. . . . :                                                                               Ron J                01 Mar 2024                                                                                                                                     LessWrong: ChatGPT is our Wright Brothers Moment                         1 2 3 4 5                      :       There’s a lot of discussions, often derisively, that many AI apps are “just” ChatGPT wrappers. I wrote a short article that was promoted to the front page of LessWrong about. . . :                                                                               Ron J                24 Dec 2022                                                                                                                                     Cohere AI: LLM Hackathon #3 3rd place winner              :       I participated practically solo in the CoHere AI Hackathon to use an early version of the Cohere LLM to make an app. The project came in third out of thousands. . . :                                                                               Ron J                12 Nov 2022                                                                                                                                     EleutherAI: Tool Use Idea              :       I created a working diagram of how a set of agent AI models could be used to answer math questions using tools. At the time I wrote this post, tool. . . :                                                                               Ron J                20 Mar 2022                                                                                                                                     SwiftUI Mars App              :       As an aficianado of the Mars Rover missions, I decided to create a simple app that would allow me to view the latest images from the Mars Rover missions. I. . . :                                                                               Ron J                08 Mar 2021                                                                                                                                     Empowering blind instructors to control classroom technology              :       One of my more successful early projects was creating a way to allow blind users to control classroom technology. The implementation used features of Crestron panels in a clever way. . . :                                                                               Ron J                14 Feb 2013                                            "
    }, {
    "id": 4,
    "url": "http://localhost:4000/robots.txt",
    "title": "",
    "body": "      Sitemap: {{ “sitemap. xml”   absolute_url }}   "
    }, {
    "id": 5,
    "url": "http://localhost:4000/vidable/",
    "title": "Vidable.ai",
    "body": "2024/05/01 - Vidable. ai was a project I worked on during my time at Vidable. It was a platform that was designed to connect to video sources, and later websites and documents, to feed an AI system. The initial release focused on a chat assistant feature, but the main R&amp;D focus i lead was looking beyond the chat box, and into creating ai generated “artifacts”. Once AI has access to a customer’s specialized data, the thinking was that by the selective nature of this data, the AI could autonomously understand the market niche, and based on the content, determine on its own what sort of things to create, from documents, to applets, to push communications. "
    }, {
    "id": 6,
    "url": "http://localhost:4000/mvizapp/",
    "title": "Apple Vision Pro Music Viz App",
    "body": "2024/03/01 - Currently a WIP, but using audio processing APIs and particle emitter SDK, i’m working on a music visualizer app to be completely immersed in a 3D field of dancing particles. "
    }, {
    "id": 7,
    "url": "http://localhost:4000/wrightbrochatgpt/",
    "title": "LessWrong: ChatGPT is our Wright Brothers Moment",
    "body": "2022/12/24 - There’s a lot of discussions, often derisively, that many AI apps are “just” ChatGPT wrappers. I wrote a short article that was promoted to the front page of LessWrong about this, trying to convey that just because a tool is an AI wrapper doesn’t mean it’s not significant. AI is opening up a whole new spectrum of possibile experiences, but just like how it took decades for air travel to be commcercialized due to a huge amount of infrastructure needing to be built, we are years away from seeing the impact of AI on our daily lives due to a multitude of new software infrastructure needing to be built. "
    }, {
    "id": 8,
    "url": "http://localhost:4000/hackathon/",
    "title": "Cohere AI: LLM Hackathon #3 3rd place winner",
    "body": "2022/11/12 - I participated practically solo in the CoHere AI Hackathon to use an early version of the Cohere LLM to make an app. The project came in third out of thousands of participants and dozens of valid submissions. The project used real-time live voice transcription that was entirely browser based, HTML Canvas compositing for live webcam video input, and a fully custom RAG (retrieval augmented generation) code written in C# before RAG was even a known terminology. Information was retrieved from Wikipedia to help ground the AI’s responses.  "
    }, {
    "id": 9,
    "url": "http://localhost:4000/eleuther/",
    "title": "EleutherAI: Tool Use Idea",
    "body": "2022/03/20 - I created a working diagram of how a set of agent AI models could be used to answer math questions using tools. At the time I wrote this post, tool use wasn’t commonly understood, nor was agent AI based processes. There are lots of powerful things you can do with the Markdown editor. If you’ve gotten pretty comfortable with writing in Markdown, then you may enjoy some more advanced tips about the types of things you can do with Markdown! As with the last post about the editor, you’ll want to be actually editing this post as you read it so that you can see all the Markdown code we’re using. "
    }, {
    "id": 10,
    "url": "http://localhost:4000/marsapp/",
    "title": "SwiftUI Mars App",
    "body": "2021/03/08 - As an aficianado of the Mars Rover missions, I decided to create a simple app that would allow me to view the latest images from the Mars Rover missions. I used SwiftUI and Xcode to create the app, and I’m quite happy with the results. The app is simple, but it does what I want it to do: show me the latest images from Mars in an easy to use UI. Dare mighty things! "
    }, {
    "id": 11,
    "url": "http://localhost:4000/blind-tech/",
    "title": "Empowering blind instructors to control classroom technology",
    "body": "2013/02/14 - One of my more successful early projects was creating a way to allow blind users to control classroom technology. The implementation used features of Crestron panels in a clever way to allow users, both blind and sighted, to swipe through a “virtual list” that could be built from just a text configuration. The gesture approach mirrored Apple’s VoiceOver screenreader, although I was completely unaware of VoiceOver at the time– the similarity was purely coincidental. "
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