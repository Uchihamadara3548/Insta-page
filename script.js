document.addEventListener("DOMContentLoaded", function() {
    const feed = document.getElementById('feed');

    let page = 1; // To keep track of the page number for infinite scrolling
    const limit = 10; // Number of posts to fetch per page
    const imageSeedPrefix = 'picsum'; // Base seed for generating unique images

    // Function to fetch and add random posts to the feed
    async function loadPosts() {
        try {
            for (let i = 0; i < limit; i++) {
                const uniqueSeed = `${imageSeedPrefix}-${Date.now()}-${i}`; // Generate a unique seed for each image
                const mediaType = Math.random() < 0.5 ? 'image' : 'video'; // Randomly choose between image or video
                let mediaUrl;

                if (mediaType === 'image') {
                    mediaUrl = `https://picsum.photos/seed/${uniqueSeed}/600/400`;
                } else {
                    mediaUrl = `https://res.cloudinary.com/druwlied9/video/upload/v1722547521/bakchodi_mat_kar_lawde_Meme_Template_CID_1080P_60FPS_tyqjir.mp4`;
                }

                // Create the post container
                const post = document.createElement('div');
                post.classList.add('post');

                // Add the post header
                const postHeader = document.createElement('div');
                postHeader.classList.add('post-header');
                postHeader.innerHTML = `
                    <div class="post-header-left">
                        <div class="profile-pic-container">
                            <img src="https://picsum.photos/32/32?random=${Math.random()}" alt="Profile Pic" class="profile-pic">
                        </div>
                        <span>Username</span>
                    </div>
                    <div class="post-header-right">
                        <span class="upload-time"> • 1w</span>
                        <iconify-icon icon="fe:elipsis-v"></iconify-icon>
                    </div>
                `;
                
                // Create and add the media element
                let mediaElement;
                if (mediaType === 'image') {
                    mediaElement = document.createElement('img');
                    mediaElement.src = mediaUrl;
                    mediaElement.classList.add('post-img');
                } else {
                    mediaElement = document.createElement('video');
                    mediaElement.classList.add('post-video');
                    mediaElement.autoplay = false;
                    mediaElement.loop = true;
                    mediaElement.muted = true;
                    mediaElement.innerHTML = `<source src="${mediaUrl}" type="video/mp4">Your browser does not support the video tag.`;
                }
                
                // Add the post footer
                const postFooter = document.createElement('div');
                postFooter.classList.add('post-footer');
                postFooter.innerHTML = `
                    <div>
                        <!-- Post interaction icons -->
                        <iconify-icon icon="mynaui:heart"></iconify-icon>
                        <iconify-icon icon="iconamoon:comment"></iconify-icon>
                        <iconify-icon icon="ion:paper-plane-outline"></iconify-icon>
                    </div>
                    <div class="like-comment-section">
                        <p class="likes">100 likes</p>
                        <p class="comment"><strong>Madara</strong> This is a sample comment...</p>
                        <span class="upload-time-footer">2 days ago</span>
                    </div>
                `;

                // Append elements to the post
                post.appendChild(postHeader);

                // Wrap media in a container if it's a video
                if (mediaType === 'video') {
                    const videoContainer = document.createElement('div');
                    videoContainer.classList.add('video-container');
                    videoContainer.appendChild(mediaElement);
                    
                    // Create and add the mute control button
                    const muteButton = document.createElement('button');
                    muteButton.classList.add('mute-control');
                    muteButton.setAttribute('aria-label', 'Mute/Unmute');
                    muteButton.innerHTML = `
                        <iconify-icon icon="mdi:mute" class="mute"></iconify-icon>
                        <iconify-icon icon="mingcute:volume-fill" class="volume"></iconify-icon>
                    `;
                    
                    videoContainer.appendChild(muteButton);
                    post.appendChild(videoContainer);
                } else {
                    post.appendChild(mediaElement);
                }
                
                post.appendChild(postFooter);

                // Append the post to the feed
                feed.appendChild(post);
            }

            // Increment page number for next fetch
            page++;
        } catch (error) {
            console.error('Error loading posts:', error);
        }

        // Initialize the Intersection Observer to handle video play/pause
        initializeIntersectionObserver();
    }

    // Load posts when the page loads
    window.addEventListener('load', loadPosts);

    // Infinite scrolling to load more posts
    window.addEventListener('scroll', () => {
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
            loadPosts(); // Call function to load more posts
        }
    });

    // Mute control functionality
    document.addEventListener('click', function(event) {
        if (event.target.closest('.mute-control')) {
            const muteButton = event.target.closest('.mute-control');
            const allVideos = document.querySelectorAll('.post-video');

            allVideos.forEach(video => {
                if (video.muted) {
                    video.muted = false;
                    muteButton.querySelector('.mute').style.display = 'none';
                    muteButton.querySelector('.volume').style.display = 'inline';
                } else {
                    video.muted = true;
                    muteButton.querySelector('.mute').style.display = 'inline';
                    muteButton.querySelector('.volume').style.display = 'none';
                }
            });

            // Update all mute control buttons to reflect the state
            const allMuteButtons = document.querySelectorAll('.mute-control');
            allMuteButtons.forEach(button => {
                if (allVideos[0].muted) {
                    button.querySelector('.mute').style.display = 'inline';
                    button.querySelector('.volume').style.display = 'none';
                } else {
                    button.querySelector('.mute').style.display = 'none';
                    button.querySelector('.volume').style.display = 'inline';
                }
            });
        }
    });

    // Intersection Observer to handle video play/pause
    function initializeIntersectionObserver() {
        const videos = document.querySelectorAll('.post-video');

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.60 // Adjust as needed
        };

        function observerCallback(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.play();
                } else {
                    entry.target.pause();
                }
            });
        }

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        videos.forEach(video => {
            observer.observe(video);
        });
    }
});
