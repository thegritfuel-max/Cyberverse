import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { 
  Shield, 
  Gamepad2, 
  Eye, 
  BrainCircuit, 
  ArrowRight, 
  School, 
  Download, 
  Play, 
  Monitor, 
  X, 
  Check, 
  Lock, 
  HardDrive,
  Wifi,
  AlertTriangle,
  FileWarning,
  Activity,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { SchoolProfile } from '../types';

interface Props {
  school: SchoolProfile;
  onEnterDashboard: () => void;
  onOpenEyeTracking: () => void;
  onOpenLoginModal: () => void;
}

export const LandingPage: React.FC<Props> = ({
  school,
  onEnterDashboard,
  onOpenEyeTracking,
  onOpenLoginModal,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  // Three.js refs for the Horizon Cosmos Hero background
  const threeRefs = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    composer: EffectComposer | null;
    stars: THREE.Points[];
    nebula: THREE.Mesh | null;
    mountains: THREE.Mesh[];
    animationId: number | null;
  }>({
    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    stars: [],
    nebula: null,
    mountains: [],
    animationId: null
  });

  // Initialize Three.js Horizon Cosmos Scene
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { current: refs } = threeRefs;

    // Scene
    refs.scene = new THREE.Scene();
    refs.scene.fog = new THREE.FogExp2(0x060814, 0.0003);

    // Camera
    const aspect = window.innerWidth / window.innerHeight;
    refs.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 2500);
    refs.camera.position.z = 120;
    refs.camera.position.y = 25;

    // Renderer
    refs.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    refs.renderer.setSize(window.innerWidth, window.innerHeight);
    refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    refs.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    refs.renderer.toneMappingExposure = 0.65;

    // Post-processing
    refs.composer = new EffectComposer(refs.renderer);
    const renderPass = new RenderPass(refs.scene, refs.camera);
    refs.composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.7,
      0.4,
      0.82
    );
    refs.composer.addPass(bloomPass);

    // 1. Create Starfield with Cyber-Cosmos Colors
    const starCount = 3800;
    for (let i = 0; i < 3; i++) {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(starCount * 3);
      const colors = new Float32Array(starCount * 3);
      const sizes = new Float32Array(starCount);

      for (let j = 0; j < starCount; j++) {
        const radius = 250 + Math.random() * 850;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);

        positions[j * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[j * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[j * 3 + 2] = radius * Math.cos(phi);

        const color = new THREE.Color();
        const rand = Math.random();
        if (rand < 0.6) {
          color.setHSL(0.76, 0.45, 0.85); // Cyber violet
        } else if (rand < 0.85) {
          color.setHSL(0.53, 0.7, 0.85);  // Electric cyan
        } else {
          color.setHSL(0.1, 0.15, 0.95);  // Pure starlight
        }

        colors[j * 3] = color.r;
        colors[j * 3 + 1] = color.g;
        colors[j * 3 + 2] = color.b;

        sizes[j] = Math.random() * 2.2 + 0.6;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          depth: { value: i }
        },
        vertexShader: `
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          uniform float time;
          uniform float depth;
          void main() {
            vColor = color;
            vec3 pos = position;
            float angle = time * 0.04 * (1.0 - depth * 0.25);
            mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
            pos.xy = rot * pos.xy;
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (280.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            float opacity = 1.0 - smoothstep(0.0, 0.5, dist);
            gl_FragColor = vec4(vColor, opacity);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      const stars = new THREE.Points(geometry, material);
      refs.scene.add(stars);
      refs.stars.push(stars);
    }

    // 2. Create Cyber Nebula
    const nebGeo = new THREE.PlaneGeometry(7000, 3500, 80, 80);
    const nebMat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0x3b0764) }, // Deep violet
        color2: { value: new THREE.Color(0x0e7490) }, // Cyber cyan-blue
        opacity: { value: 0.38 }
      },
      vertexShader: `
        varying vec2 vUv;
        varying float vElevation;
        uniform float time;
        void main() {
          vUv = uv;
          vec3 pos = position;
          float elevation = sin(pos.x * 0.008 + time * 0.6) * cos(pos.y * 0.008 + time * 0.6) * 25.0;
          pos.z += elevation;
          vElevation = elevation;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        uniform float opacity;
        uniform float time;
        varying vec2 vUv;
        varying float vElevation;
        void main() {
          float mixFactor = sin(vUv.x * 8.0 + time * 0.4) * cos(vUv.y * 8.0 + time * 0.4);
          vec3 color = mix(color1, color2, mixFactor * 0.5 + 0.5);
          float alpha = opacity * (1.0 - length(vUv - 0.5) * 2.0);
          alpha *= 1.0 + vElevation * 0.01;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    const nebula = new THREE.Mesh(nebGeo, nebMat);
    nebula.position.z = -900;
    nebula.position.y = 150;
    refs.scene.add(nebula);
    refs.nebula = nebula;

    // 3. Create Cyber Mountain Horizon
    const layers = [
      { distance: -60, height: 65, color: 0x060814, opacity: 1 },
      { distance: -120, height: 85, color: 0x0f172a, opacity: 0.88 },
      { distance: -180, height: 110, color: 0x1e1b4b, opacity: 0.68 },
      { distance: -240, height: 135, color: 0x2e1065, opacity: 0.45 }
    ];

    layers.forEach((layer, index) => {
      const points: THREE.Vector2[] = [];
      const segments = 60;
      for (let i = 0; i <= segments; i++) {
        const x = (i / segments - 0.5) * 1200;
        const y = Math.sin(i * 0.12) * layer.height +
                 Math.sin(i * 0.06) * layer.height * 0.5 +
                 Math.cos(i * 0.2) * (layer.height * 0.2) - 80;
        points.push(new THREE.Vector2(x, y));
      }
      points.push(new THREE.Vector2(6000, -350));
      points.push(new THREE.Vector2(-6000, -350));

      const shape = new THREE.Shape(points);
      const geom = new THREE.ShapeGeometry(shape);
      const mat = new THREE.MeshBasicMaterial({
        color: layer.color,
        transparent: true,
        opacity: layer.opacity,
        side: THREE.DoubleSide
      });

      const mountain = new THREE.Mesh(geom, mat);
      mountain.position.z = layer.distance;
      mountain.position.y = -20;
      mountain.userData = { baseZ: layer.distance, index };
      refs.scene.add(mountain);
      refs.mountains.push(mountain);
    });

    // Animate Loop
    const animate = () => {
      refs.animationId = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;

      refs.stars.forEach((sf) => {
        const mat = sf.material as THREE.ShaderMaterial;
        if (mat.uniforms) mat.uniforms.time.value = time;
      });

      if (refs.nebula) {
        const mat = refs.nebula.material as THREE.ShaderMaterial;
        if (mat.uniforms) mat.uniforms.time.value = time * 0.5;
      }

      refs.mountains.forEach((m, i) => {
        const factor = 1 + i * 0.4;
        m.position.x = Math.sin(time * 0.08) * 1.5 * factor;
      });

      if (refs.camera) {
        refs.camera.position.x = Math.sin(time * 0.1) * 2;
        refs.camera.position.y = 25 + Math.cos(time * 0.12) * 1.2;
        refs.camera.lookAt(0, 10, -500);
      }

      if (refs.composer) {
        refs.composer.render();
      }
    };

    animate();

    const handleResize = () => {
      if (!refs.camera || !refs.renderer || !refs.composer) return;
      refs.camera.aspect = window.innerWidth / window.innerHeight;
      refs.camera.updateProjectionMatrix();
      refs.renderer.setSize(window.innerWidth, window.innerHeight);
      refs.composer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (refs.animationId) cancelAnimationFrame(refs.animationId);
      window.removeEventListener('resize', handleResize);
      if (refs.renderer) refs.renderer.dispose();
    };
  }, []);

  // Handle Windows Game Download
  const handleDownloadCyberVerse = () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    setDownloadModalOpen(true);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          triggerActualDownload();
          return 100;
        }
        return prev + 15;
      });
    }, 250);
  };

  const triggerActualDownload = () => {
    const fileContent = `=====================================================
CYBERVERSE: 3D CYBERSECURITY TACTICAL SIMULATOR
Version: 2.4.0 (Windows 64-bit Standalone Edition)
Target: Academic & Engineering Institutional Labs
Partner Institution: KIT's College of Engineering (Autonomous), Kolhapur
Department: Computer Science & Cybersecurity
Faculty Supervisor & HOD: Dr. Kiran Patil
=====================================================

INSTALLATION & LAUNCH INSTRUCTIONS:
1. Extract CyberVerse_Game_Windows_x64.zip to your local system (e.g., C:\\CyberVerse).
2. Ensure DirectX 11 or higher runtime is installed.
3. Launch "CyberVerse.exe" with standard user permissions (Administrator not required).
4. Connect standard 720p/1080p webcam for live 60 FPS iris biometric tracking or toggle Synthetic Sensor Mode.
5. Enter student roll number or faculty access token to sync scores with the Institutional ERP portal.

SECURITY & PRIVACY GUARANTEE:
- Zero raw webcam video is captured or transmitted.
- 100% offline simulation execution supported.
- Behavioral telemetry is computed strictly in local memory.
=====================================================`;

    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'CyberVerse_Game_Windows_x64_Setup.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#060814] text-white flex flex-col selection:bg-purple-600 selection:text-white relative overflow-x-hidden">
      
      {/* 3D HORIZON COSMOS CANVAS BACKGROUND */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-90"
      />

      {/* TOP FLOATING LIQUID GLASS NAVBAR */}
      <div className="sticky top-4 z-50 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <header className="liquid-glass-nav rounded-full px-5 sm:px-8 py-3.5 flex items-center justify-between gap-4 transition-all">
          
          {/* CyberVerse Brand Logo */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.7)] border border-white/20">
              <Shield className="w-5 h-5 text-cyan-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white text-lg sm:text-xl tracking-tight">CyberVerse</span>
                <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full tracking-wider hidden sm:inline-block">
                  Defense Simulator
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-300">
            <a href="#value-props" className="hover:text-cyan-400 transition-colors">
              Value Props
            </a>
            <a href="#missions" className="hover:text-cyan-400 transition-colors">
              Threat Missions
            </a>
            <a href="#telemetry" className="hover:text-cyan-400 transition-colors">
              Iris Biometrics
            </a>
            <a href="#faculty" className="hover:text-cyan-400 transition-colors">
              KIT Autonomous
            </a>
            <a href="#specs" className="hover:text-cyan-400 transition-colors">
              Specs
            </a>
          </nav>

          {/* Actions on Right */}
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenLoginModal}
              className="text-xs font-extrabold uppercase tracking-wider text-slate-300 hover:text-white transition-colors px-2 py-1 cursor-pointer"
            >
              Teacher Login
            </button>

            <button
              onClick={onEnterDashboard}
              className="liquid-glass-btn-purple text-white text-xs font-black uppercase tracking-wider px-6 py-2.5 rounded-full cursor-pointer flex items-center gap-2"
            >
              <span>Teacher Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>
      </div>

      {/* HERO SECTION: STRICT CYBERSECURITY FOCUS WITH LIQUID GLASS VISUAL STYLING */}
      <section className="relative z-10 pt-16 sm:pt-22 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center max-w-6xl mx-auto">
        
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass-nav border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
          <Shield className="w-3.5 h-3.5 text-cyan-400" />
          <span>Autonomous Academic Defense Initiative • 3D Tactical Simulation</span>
        </div>

        {/* Main Display Headline */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.12]">
            Train Reflexes Against Modern Intrusions In
          </h1>

          {/* Stylized Angled Sticker Capsule */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 my-2">
            <span className="cyber-hero-capsule text-3xl sm:text-5xl lg:text-6xl font-black px-6 sm:px-8 py-2 sm:py-3 rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-purple-300">
              Tactical 3D
            </span>
            <span className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight">
              CyberVerse
            </span>
          </div>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed pt-2">
            An autonomous behavioral cybersecurity training environment designed for university engineering students. Triage deceptive spear-phishing campaigns, isolate rogue campus Wi-Fi APs, and neutralize ransomware propagation with real-time 60 FPS iris biometric telemetry.
          </p>
        </div>

        {/* PRIMARY HERO ACTION: SINGLE DOWNLOAD BUTTON */}
        <div className="mt-8 flex flex-col items-center justify-center">
          <button
            onClick={handleDownloadCyberVerse}
            className="group relative px-9 sm:px-12 py-4 sm:py-5 liquid-glass-btn-purple text-white font-black text-sm sm:text-base uppercase tracking-wider rounded-full shadow-[0_0_50px_rgba(124,58,237,0.7)] hover:shadow-[0_0_75px_rgba(139,92,246,0.95)] hover:scale-105 active:scale-95 transition-all flex items-center gap-4 border border-white/30 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
              <Monitor className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <div className="font-black text-sm sm:text-base leading-tight">DOWNLOAD CYBERVERSE FOR WINDOWS</div>
              <div className="text-[10px] font-mono text-purple-200 tracking-wider font-semibold">BUILD v2.4.0 • 64-BIT STANDALONE GAME</div>
            </div>
            <Download className="w-5 h-5 text-white transition-transform group-hover:translate-y-1 ml-2" />
          </button>
        </div>

        {/* HERO TRUST & INTEGRITY BADGES */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-bold text-slate-300">
          <button 
            onClick={() => setDemoModalOpen(true)}
            className="flex items-center gap-2 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full border border-slate-400/50 flex items-center justify-center bg-white/5">
              <Play className="w-3 h-3 fill-white text-white ml-0.5" />
            </div>
            <span>WATCH GAMEPLAY DEMO</span>
          </button>

          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
            <span>60 FPS IRIS EYE TRACKING</span>
          </div>

          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>100% OFFLINE LAB EXECUTION</span>
          </div>

          <div className="flex items-center gap-2">
            <School className="w-4 h-4 text-purple-400" />
            <span>KIT AUTONOMOUS ACCREDITED</span>
          </div>
        </div>

        {/* CORE CYBERSECURITY VALUE PROPOSITIONS GRID */}
        <div id="value-props" className="mt-14 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
          
          <div className="liquid-glass-card p-5 sm:p-6 rounded-2xl border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center">
              <FileWarning className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm sm:text-base">Deception &amp; Phishing Defense</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Exposes deceptive lookalike institutional domains, forged administrative headers, and weaponized attachments in authentic email simulations.
            </p>
            <div className="pt-1 flex items-center gap-1.5 text-[11px] text-purple-300 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
              <span>SPF / DKIM Header Analysis</span>
            </div>
          </div>

          <div className="liquid-glass-card p-5 sm:p-6 rounded-2xl border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm sm:text-base">Live Biometric Gaze Telemetry</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              60 FPS webcam-based gaze tracking calculates microsecond hesitation latency and visual scanpaths across URLs without storing raw video.
            </p>
            <div className="pt-1 flex items-center gap-1.5 text-[11px] text-cyan-300 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Fixation Heatmap Engine</span>
            </div>
          </div>

          <div className="liquid-glass-card p-5 sm:p-6 rounded-2xl border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Wifi className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm sm:text-base">Tactical Incident Quarantine</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Interactive incident handling for rogue evil twin Wi-Fi networks, malicious drop drives, and automated network containment drills.
            </p>
            <div className="pt-1 flex items-center gap-1.5 text-[11px] text-amber-300 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Air-Gapping &amp; Isolation Drills</span>
            </div>
          </div>

          <div className="liquid-glass-card p-5 sm:p-6 rounded-2xl border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm sm:text-base">Institutional Teacher ERP</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Real-time faculty command center with student vulnerability matrices, automated academic certificate generation, and cohort leaderboards.
            </p>
            <div className="pt-1 flex items-center gap-1.5 text-[11px] text-emerald-300 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Accredited Skill Rubrics</span>
            </div>
          </div>

        </div>

      </section>

      {/* 4 IN-GAME CYBERSECURITY MISSIONS */}
      <section id="missions" className="relative z-10 py-20 bg-slate-950/80 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
              Interactive Tactical Scenarios
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              4 Real-World Threat Vectors Simulated In 3D
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Every scenario simulates authentic deceptive mechanisms faced by students and staff across university networks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Scenario 1 */}
            <div className="liquid-glass-card p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center shadow-md">
                <FileWarning className="w-5 h-5" />
              </div>
              <div className="text-[11px] font-mono font-bold text-purple-400">LEVEL 1 • SOCIAL ENGINEERING</div>
              <h3 className="font-bold text-white text-base">Dean Phishing Notice</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Spoofed university authority email requesting immediate credential verification before exam registration lockouts.
              </p>
              <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>Fixation on sender domain</span>
              </div>
            </div>

            {/* Scenario 2 */}
            <div className="liquid-glass-card p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-md">
                <Wifi className="w-5 h-5" />
              </div>
              <div className="text-[11px] font-mono font-bold text-cyan-400">LEVEL 2 • NETWORK ATTACK</div>
              <h3 className="font-bold text-white text-base">Evil Twin Campus Wi-Fi</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Rogue wireless access point broadcasting an unencrypted clone of the institution's student Wi-Fi portal.
              </p>
              <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>Captive portal SSL inspection</span>
              </div>
            </div>

            {/* Scenario 3 */}
            <div className="liquid-glass-card p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-md">
                <HardDrive className="w-5 h-5" />
              </div>
              <div className="text-[11px] font-mono font-bold text-amber-400">LEVEL 3 • PHYSICAL PERIMETER</div>
              <h3 className="font-bold text-white text-base">Malicious USB Drop</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Unattended thumb drive labeled "Final Exam Solutions 2026" left in the library lounge attempting autorun payload triggers.
              </p>
              <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Hesitation latency calculation</span>
              </div>
            </div>

            {/* Scenario 4 */}
            <div className="liquid-glass-card p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center shadow-md">
                <Lock className="w-5 h-5" />
              </div>
              <div className="text-[11px] font-mono font-bold text-rose-400">LEVEL 4 • ADVANCED INCIDENT</div>
              <h3 className="font-bold text-white text-base">Ransomware Quarantine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Simulated encrypted file payload execution requiring emergency network isolation and credential rotation.
              </p>
              <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400">
                <Shield className="w-3.5 h-3.5 text-rose-400" />
                <span>Isolation reflex response speed</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* BIOMETRIC EYE-TRACKING & ERP ANALYTICS */}
      <section id="telemetry" className="relative z-10 py-20 bg-slate-900/60 backdrop-blur-md border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full cyber-badge-cyan text-xs font-mono font-bold uppercase">
                <Eye className="w-3.5 h-3.5" />
                <span>Webcam Telemetry Integration</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Evaluating Instincts, Not Just Guesswork
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                Standard multiple-choice quizzes fail to capture whether a student genuinely spotted deceptive indicators or simply guessed correctly. CyberVerse tracks continuous biometric vectors:
              </p>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-3 p-3 bg-slate-950/60 rounded-xl border border-white/10">
                  <BrainCircuit className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-white block">URL Gaze Duration</span>
                    <span>Measures whether the student checked the sender address domain and TLS lock before clicking links.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-950/60 rounded-xl border border-white/10">
                  <Activity className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-white block">Hesitation Latency Score</span>
                    <span>Quantifies microsecond cognitive hesitation when encountering spoofed prompts or unexpected dialogs.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-950/60 rounded-xl border border-white/10">
                  <Layers className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-white block">Visual Scanpath Mapping</span>
                    <span>Reconstructs eye movement journeys across deceptive security dialogs for post-simulation student debriefs.</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={onOpenEyeTracking}
                  className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl inline-flex items-center gap-2 transition-all shadow-lg shadow-cyan-600/30 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>Launch Live Gaze Lab</span>
                </button>
                <button
                  onClick={onEnterDashboard}
                  className="px-6 py-3 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 font-bold text-xs uppercase tracking-wider rounded-xl inline-flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>Teacher ERP Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Simulated Eye Tracking Telemetry Visual Panel */}
            <div className="liquid-glass-nav p-6 rounded-3xl border border-white/15 space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-mono font-bold text-emerald-400">GAZE SENSOR ACTIVE (60 FPS)</span>
                </div>
                <span className="text-xs font-mono text-slate-400">IRIS VECTOR: [X: 0.54, Y: 0.81]</span>
              </div>

              <div className="relative aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-cyan-500/30 p-4 flex flex-col justify-between">
                <div className="flex justify-between text-[10px] font-mono text-cyan-400">
                  <span>TARGET: CAMPUS_LOGIN_SPOOF.EXE</span>
                  <span>CONFIDENCE: 98.4%</span>
                </div>

                {/* Reticle Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-28 h-28 rounded-full border border-cyan-400/40 animate-pulse flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border-2 border-purple-500/80 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-end text-[11px] font-mono">
                  <div className="bg-purple-950/80 px-2.5 py-1 rounded border border-purple-500/40 text-purple-300">
                    Fixation: 2.14s on URL Bar
                  </div>
                  <div className="bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-500/40 text-emerald-300">
                    Status: Threat Identified
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-950/80 rounded-xl border border-white/10">
                  <div className="text-lg font-black text-cyan-400">92%</div>
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Vigilance Index</div>
                </div>
                <div className="p-3 bg-slate-950/80 rounded-xl border border-white/10">
                  <div className="text-lg font-black text-purple-400">1.4s</div>
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Hesitation Latency</div>
                </div>
                <div className="p-3 bg-slate-950/80 rounded-xl border border-white/10">
                  <div className="text-lg font-black text-emerald-400">Grade A</div>
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Institutional Score</div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* HARDWARE & SYSTEM SPECS */}
      <section id="specs" className="relative z-10 py-16 bg-slate-950/80 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="liquid-glass-nav p-8 rounded-3xl border border-white/15">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/10">
              <div>
                <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider block">
                  Standalone Windows Deployment
                </span>
                <h3 className="text-2xl font-black text-white">System &amp; Hardware Specifications</h3>
              </div>
              <button
                onClick={handleDownloadCyberVerse}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Get Windows Installer</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-slate-400 uppercase">Operating System</span>
                <p className="font-bold text-white text-sm">Windows 10 / 11 (64-bit)</p>
                <p className="text-[11px] text-slate-500">Standalone offline setup supported</p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono text-slate-400 uppercase">Processor &amp; Memory</span>
                <p className="font-bold text-white text-sm">Intel i5 / Ryzen 5 • 8 GB RAM</p>
                <p className="text-[11px] text-slate-500">DirectX 11 compatible GPU</p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono text-slate-400 uppercase">Sensors / Biometrics</span>
                <p className="font-bold text-white text-sm">Standard 720p/1080p Webcam</p>
                <p className="text-[11px] text-slate-500">Or integrated synthetic sensor mode</p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono text-slate-400 uppercase">Storage &amp; Package</span>
                <p className="font-bold text-white text-sm">1.5 GB Local Storage Space</p>
                <p className="text-[11px] text-slate-500">Pre-compiled Unity 3D executable</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INSTITUTIONAL HIGHLIGHT: KIT'S COLLEGE OF ENGINEERING (AUTONOMOUS) */}
      <section id="faculty" className="relative z-10 py-16 bg-slate-900/60 backdrop-blur-md border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="liquid-glass-nav p-6 sm:p-8 rounded-3xl border border-white/15 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-5">
              <img 
                src="https://i.postimg.cc/5yYw8KNq/kit-logo.png" 
                alt="KIT's College of Engineering Kolhapur"
                className="h-16 w-auto object-contain bg-white/90 p-2 rounded-2xl shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest block">
                  Autonomous Research Integration
                </span>
                <h3 className="text-xl font-bold text-white">
                  Kolhapur Institute of Technology's College of Engineering (Empowered Autonomous)
                </h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  Department of Computer Science &amp; Cybersecurity | Head of Department: <strong>Dr. Kiran Patil</strong>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={onOpenEyeTracking}
                className="px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>Open Gaze Lab</span>
              </button>
              <button
                onClick={onEnterDashboard}
                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all border border-white/20 cursor-pointer"
              >
                <span>Teacher ERP Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* STANDARD CLEAN PROFESSIONAL FOOTER DESIGN */}
      <footer className="relative z-10 bg-[#070913] text-slate-300 border-t border-slate-800/80 pt-16 pb-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Footer Row: Brand, Accreditation & Navigation Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-12 border-b border-slate-800/80">
            
            {/* Brand and Accreditation Column */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-purple-900/30">
                  <Shield className="w-5 h-5 text-cyan-200" />
                </div>
                <div>
                  <span className="font-bold text-white text-base tracking-tight block">CyberVerse</span>
                  <span className="text-[11px] text-slate-400">Autonomous Cybersecurity Defense Simulator</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Next-generation 3D behavioral cybersecurity training platform equipped with 60 FPS iris biometric tracking and automated teacher analytics.
              </p>

              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2 text-[11px] text-slate-300">
                  <School className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>KIT's College of Engineering (Autonomous), Kolhapur</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                  <span>Supervisor &amp; HOD: Dr. Kiran Patil</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>All 4 Simulation Threat Vectors Operational</span>
              </div>
            </div>

            {/* Column 1: Tactical Simulations */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">Tactical Missions</h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li><a href="#missions" className="hover:text-cyan-400 transition-colors">Dean Phishing Notice</a></li>
                <li><a href="#missions" className="hover:text-cyan-400 transition-colors">Evil Twin Wi-Fi Portal</a></li>
                <li><a href="#missions" className="hover:text-cyan-400 transition-colors">Malicious USB Drop</a></li>
                <li><a href="#missions" className="hover:text-cyan-400 transition-colors">Ransomware Quarantine</a></li>
                <li><a href="#missions" className="hover:text-cyan-400 transition-colors">Credential Harvester Drill</a></li>
              </ul>
            </div>

            {/* Column 2: Biometric Telemetry */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">Iris Biometrics</h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li><button onClick={onOpenEyeTracking} className="hover:text-cyan-400 transition-colors text-left cursor-pointer">Live Gaze Tracking Lab</button></li>
                <li><button onClick={onOpenEyeTracking} className="hover:text-cyan-400 transition-colors text-left cursor-pointer">Hesitation Latency Score</button></li>
                <li><button onClick={onOpenEyeTracking} className="hover:text-cyan-400 transition-colors text-left cursor-pointer">Fixation Scanpath Replay</button></li>
                <li><button onClick={onOpenEyeTracking} className="hover:text-cyan-400 transition-colors text-left cursor-pointer">Visual Vigilance Index</button></li>
                <li><button onClick={onOpenEyeTracking} className="hover:text-cyan-400 transition-colors text-left cursor-pointer">Webcam Sensor Calibration</button></li>
              </ul>
            </div>

            {/* Column 3: Teacher ERP Portal */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">Teacher ERP Portal</h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li><button onClick={onEnterDashboard} className="hover:text-cyan-400 transition-colors text-left cursor-pointer">Teacher Command Center</button></li>
                <li><button onClick={onEnterDashboard} className="hover:text-cyan-400 transition-colors text-left cursor-pointer">Student Cohort Directory</button></li>
                <li><button onClick={onEnterDashboard} className="hover:text-cyan-400 transition-colors text-left cursor-pointer">Skill Matrix Benchmarks</button></li>
                <li><button onClick={onEnterDashboard} className="hover:text-cyan-400 transition-colors text-left cursor-pointer">Automated Certificate Hub</button></li>
                <li><button onClick={onEnterDashboard} className="hover:text-cyan-400 transition-colors text-left cursor-pointer">Leaderboard &amp; Ranking</button></li>
              </ul>
            </div>

            {/* Column 4: Platform & Support */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">Platform &amp; Specs</h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li>
                  <button onClick={handleDownloadCyberVerse} className="text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer">
                    Windows 64-bit Game (.zip)
                  </button>
                </li>
                <li><a href="#specs" className="hover:text-slate-200 transition-colors">DirectX 11 Hardware Specs</a></li>
                <li><a href="#specs" className="hover:text-slate-200 transition-colors">Offline Academic Lab Mode</a></li>
                <li><a href="#faculty" className="hover:text-slate-200 transition-colors">KIT Autonomous Syllabus</a></li>
                <li><a href="#faculty" className="hover:text-slate-200 transition-colors">Dr. Kiran Patil Research Lab</a></li>
              </ul>
            </div>

          </div>

          {/* Bottom Sub-Footer: Copyright, Privacy & Institutional Notice */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <div>
              &copy; {new Date().getFullYear()} CyberVerse Simulator. Kolhapur Institute of Technology's College of Engineering (Empowered Autonomous). All rights reserved.
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <span className="hover:text-slate-300 cursor-pointer">Student Data Privacy Standard</span>
              <span>•</span>
              <span className="hover:text-slate-300 cursor-pointer">Zero Cloud Telemetry Retention</span>
              <span>•</span>
              <span className="text-purple-400 font-mono">Build v2.4.0 (Windows x64)</span>
            </div>
          </div>

        </div>
      </footer>

      {/* WINDOWS GAME DOWNLOAD LAUNCHER MODAL */}
      {downloadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="liquid-glass-nav max-w-lg w-full rounded-3xl border border-white/20 p-6 sm:p-8 space-y-6 text-white shadow-2xl relative">
            <button
              onClick={() => setDownloadModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-600/40 shrink-0">
                <Monitor className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">CyberVerse 3D for Windows</h3>
                <p className="text-xs text-slate-300 font-mono">Build v2.4.0 • Windows 10/11 64-bit Edition</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-purple-400 font-bold">
                  {isDownloading ? 'Preparing Windows Installer Archive...' : 'Download Ready!'}
                </span>
                <span className="text-slate-300">{downloadProgress}%</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-white/10 p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 rounded-full transition-all duration-300"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
            </div>

            {/* Package Specifications */}
            <div className="p-4 bg-slate-900/80 rounded-2xl border border-white/10 space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Package:</span>
                <span className="font-mono text-white font-bold">CyberVerse_Game_Windows_x64.zip</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">File Size:</span>
                <span className="font-mono text-white">1.2 GB (Compressed)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Supported Hardware:</span>
                <span className="text-emerald-400 font-semibold">DirectX 11, Any Standard Webcam</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Academic License:</span>
                <span className="text-purple-300 font-semibold">KIT Autonomous Verified</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={triggerActualDownload}
                className="flex-1 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-600/40 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Save Setup File (.zip)</span>
              </button>
              <button
                onClick={() => setDownloadModalOpen(false)}
                className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WATCH DEMO MODAL */}
      {demoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="liquid-glass-nav max-w-2xl w-full rounded-3xl border border-white/20 p-6 space-y-4 text-white shadow-2xl relative">
            <button
              onClick={() => setDemoModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider">
                Simulation Gameplay &amp; Gaze Telemetry
              </span>
              <h3 className="text-xl font-black text-white">CyberVerse 3D Simulation Walkthrough</h3>
            </div>

            {/* Video / Interactive Simulation Mockup Container */}
            <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-white/15 flex items-center justify-center p-6 text-center">
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-full bg-purple-600/30 border border-purple-500 flex items-center justify-center mx-auto text-purple-400 animate-pulse">
                  <Gamepad2 className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-white text-base">Unity 3D Examination Phishing Mission</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Watch as students navigate first-person campus hallways, inspect spoofed dean communications, and undergo real camera biometric evaluation.
                </p>
                <button
                  onClick={() => {
                    setDemoModalOpen(false);
                    onOpenEyeTracking();
                  }}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl inline-flex items-center gap-2 mt-2 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>Launch Live Eye-Tracking Lab Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LandingPage;
