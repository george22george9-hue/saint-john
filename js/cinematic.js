/**
 * cinematic.js - Premium UI/UX Animations (Three.js & GSAP)
 * Implements 3D Cross, Custom Cursors, Floating Logo, and Cinematic Scroll Effects.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Custom Cursor
    const cursor = document.getElementById('custom-cursor');
    const cursorFollower = document.getElementById('custom-cursor-follower');
    
    if (cursor && cursorFollower && window.innerWidth >= 1024) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Instantly move the inner dot
            cursor.style.left = `${mouseX}px`;
            cursor.style.top = `${mouseY}px`;
        });
        
        // Smooth follow for the outer ring using GSAP ticker or requestAnimationFrame
        function animateCursor() {
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            
            cursorFollower.style.left = `${followerX}px`;
            cursorFollower.style.top = `${followerY}px`;
            
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
        
        // Hover effects on magnet elements (buttons, links)
        const magnets = document.querySelectorAll('a, button, .hover-magnet');
        magnets.forEach(el => {
            el.addEventListener('mouseenter', () => cursorFollower.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => cursorFollower.classList.remove('cursor-hover'));
        });
    }

    // 2. Scroll Progress Bar
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = `${scrollPercent}%`;
        });
    }

    // 3. Floating Meeting Logo Animation
    const floatingLogo = document.getElementById('floating-logo');
    if (floatingLogo) {
        // Idle animation
        gsap.to(floatingLogo, {
            y: 20,
            rotation: 5,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
        
        // Scroll interaction
        gsap.to(floatingLogo, {
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: 1
            },
            y: "50vh",
            x: "5vw",
            rotation: 360,
            scale: 0.8,
            opacity: window.innerWidth > 768 ? 1 : 0.5
        });
    }

    // 4. GSAP Scroll Entrance Animations
    gsap.registerPlugin(ScrollTrigger);
    
    // Fade Up Elements
    gsap.utils.toArray('.gsap-fade-up').forEach(element => {
        gsap.fromTo(element, 
            { opacity: 0, y: 50 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 1.2, 
                ease: "power3.out",
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // Fade Right Elements
    gsap.utils.toArray('.gsap-fade-right').forEach(element => {
        gsap.fromTo(element, 
            { opacity: 0, x: -50 },
            { 
                opacity: 1, 
                x: 0, 
                duration: 1.2, 
                ease: "power3.out",
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // Fade Left Elements
    gsap.utils.toArray('.gsap-fade-left').forEach(element => {
        gsap.fromTo(element, 
            { opacity: 0, x: 50 },
            { 
                opacity: 1, 
                x: 0, 
                duration: 1.2, 
                ease: "power3.out",
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // Scale Elements (like FAB)
    gsap.utils.toArray('.gsap-scale').forEach(element => {
        gsap.fromTo(element, 
            { opacity: 0, scale: 0.5 },
            { 
                opacity: 1, 
                scale: 1, 
                duration: 1, 
                ease: "elastic.out(1, 0.5)",
                scrollTrigger: {
                    trigger: element,
                    start: "top 95%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // 5. Hero Entrance Timeline
    const tl = gsap.timeline();
    tl.fromTo('.gsap-nav', { y: -100, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" })
      .fromTo('.gsap-title', { opacity: 0, y: 30, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.5, ease: "power3.out" }, "-=0.5")
      .fromTo('.gsap-subtitle', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, "-=1")
      .fromTo('#floating-logo', { opacity: 0, scale: 0 }, { opacity: window.innerWidth > 768 ? 1 : 0.5, scale: 1, duration: 1.5, ease: "elastic.out(1, 0.5)" }, "-=1.2");

    // 6. Three.js 3D Cross & Particles Scene
    initThreeJsScene();
});

function initThreeJsScene() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    // Scene Setup
    const scene = new THREE.Scene();
    // Use a cinematic deep blue/black fog to blend the scene
    scene.fog = new THREE.FogExp2(0x070e24, 0.002);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- 3D Cross Creation ---
    const crossGroup = new THREE.Group();
    
    // Premium Gold Material
    const goldMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        roughness: 0.2,
        metalness: 0.8,
        emissive: 0x332200, // Slight glow
        emissiveIntensity: 0.5
    });

    // Vertical Beam
    const verticalGeo = new THREE.BoxGeometry(1, 8, 1);
    const verticalBeam = new THREE.Mesh(verticalGeo, goldMaterial);
    
    // Horizontal Beam
    const horizontalGeo = new THREE.BoxGeometry(5, 1, 1);
    const horizontalBeam = new THREE.Mesh(horizontalGeo, goldMaterial);
    horizontalBeam.position.y = 1.5; // Shift up slightly for standard cross proportions

    crossGroup.add(verticalBeam);
    crossGroup.add(horizontalBeam);
    
    // Position cross slightly to the right on desktop, center on mobile
    crossGroup.position.x = window.innerWidth > 768 ? 4 : 0;
    crossGroup.position.z = -5;
    scene.add(crossGroup);

    // --- Particles (Cinematic Dust) ---
    const particleCount = window.innerWidth > 768 ? 1500 : 500; // Optimize for mobile
    const particlesGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    
    for(let i = 0; i < particleCount * 3; i++) {
        // Spread particles widely across the scene
        posArray[i] = (Math.random() - 0.5) * 50; 
    }
    
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0xd4af37, // Gold dust
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeo, particlesMaterial);
    scene.add(particlesMesh);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffd700, 1.5); // Golden directional light
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x0055ff, 2, 50); // Deep blue point light for contrast
    pointLight.position.set(-5, -5, 5);
    scene.add(pointLight);

    // --- Scroll Interaction (GSAP) ---
    // Smoothly rotate the cross as user scrolls down the page
    gsap.to(crossGroup.rotation, {
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5 // Smooth scrubbing
        },
        x: Math.PI * 0.5,
        y: Math.PI * 2,
        z: Math.PI * 0.2
    });

    // Move cross downwards so it stays somewhat visible but falls behind content
    gsap.to(crossGroup.position, {
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5
        },
        y: -10,
        z: -15
    });

    // --- Animation Loop ---
    let mouseX = 0;
    let mouseY = 0;
    
    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) - 0.5;
            mouseY = (event.clientY / window.innerHeight) - 0.5;
        });
    }

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        
        const elapsedTime = clock.getElapsedTime();

        // Idle floating for the cross
        crossGroup.position.y += Math.sin(elapsedTime * 2) * 0.005;
        
        // Slight rotation based on mouse position (Parallax)
        crossGroup.rotation.x += (mouseY * 0.5 - crossGroup.rotation.x) * 0.05;
        crossGroup.rotation.y += (mouseX * 0.5 - crossGroup.rotation.y) * 0.05;

        // Animate particles (slowly moving upwards and rotating)
        particlesMesh.rotation.y = elapsedTime * 0.02;
        particlesMesh.position.y = (elapsedTime * 0.5) % 25; // Reset position to loop

        renderer.render(scene, camera);
    }
    
    // Fade in the cross initially
    crossGroup.scale.set(0, 0, 0);
    gsap.to(crossGroup.scale, { x: 1, y: 1, z: 1, duration: 2, ease: "elastic.out(1, 0.7)", delay: 0.5 });

    animate();

    // --- Handle Resize ---
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Reposition cross on mobile
        crossGroup.position.x = window.innerWidth > 768 ? 4 : 0;
    });
}
