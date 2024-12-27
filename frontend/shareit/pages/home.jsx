import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import SHARE from './shareit'

const Home = () => {
  const headerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // GSAP animation for header elements
    gsap.from(headerRef.current, {
      opacity: 0,
      y: -50,
      duration: 1,
      ease: 'power2.out',
    });

    // Canvas background animation
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 50;

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: Math.random() * 9 - 1,
        speedY: Math.random() * 2 - 1
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach((particle, index) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Bounce off walls
        if (particle.x > canvas.width || particle.x < 0) particle.speedX *= -1;
        if (particle.y > canvas.height || particle.y < 0) particle.speedY *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(100, 100, 100, 0.5)';
        ctx.fill();

        // Draw connections
        particles.forEach((particle2, index2) => {
          if (index !== index2) {
            const dx = particle.x - particle2.x;
            const dy = particle.y - particle2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(100, 100, 100, ${0.2 - distance/500})`;
              ctx.lineWidth = 1;
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(particle2.x, particle2.y);
              ctx.stroke();
            }
          }
        });
      });

      requestAnimationFrame(animate);
    }

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animate);
    };
  }, []);

  return (
    <div className="home-container" style={{backgroundImage: 'url(https://source.unsplash.com/1600x900/?nature)'}}>
      <canvas 
        ref={canvasRef} 
        style={{
          position: 'fixed',
          top: 0,
          left: 0, 
          zIndex: -1
        }}
      />
      <nav ref={headerRef} className="home-header" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-between',
        padding: '1rem 2rem',
        backgroundColor: 'rgba(255, 255, 255, 0.9)'
      }}>
        <div className="nav-left">
          <h1>ShareIt</h1>
        </div>
        <div className="nav-right">
          <a
            href="https://github.com/your-github-username"
            target="_blank"
            rel="noopener noreferrer"
            className="github-button"
          >
            Follow me on GitHub
          </a>
        </div>
      </nav>
      <main className="home-main" style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        <section className="hero-section">
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&display=swap" rel="stylesheet" />
          <h2 style={{
            fontSize: '4.5rem',
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700,
            marginBottom: '1.5rem',
            background: 'linear-gradient(45deg, #2196F3, #00BCD4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Welcome to ShareIt</h2>
          <p style={{
            fontSize: '1.5rem',
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            color: '#666',
            marginBottom: '2.5rem'
          }}>Effortlessly share files with friends, colleagues, and beyond.</p>
          <Link to="/share" style={{
            display: 'inline-block',
            padding: '1rem 3rem',
            fontSize: '1.25rem',
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            color: 'white',
            background: 'linear-gradient(45deg, #2196F3, #00BCD4)',
            borderRadius: '50px',
            textDecoration: 'none',
            boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            ':hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(26, 41, 54, 0.4)'
            }
          }}>
            Get Started
          </Link>
        </section>
      </main>
    </div>
  );
};

export default Home;
