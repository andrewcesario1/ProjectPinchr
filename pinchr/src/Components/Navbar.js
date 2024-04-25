import React, { useEffect, useState, useRef } from 'react';
import { auth, db } from '../firebase';
import { useNavigate, Link } from "react-router-dom";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import "../Styles/navbar.css";
import { useGLTF, Stage, Resize, Bounds } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';



function Model(props) {
  const group = useRef();
  const { nodes, materials } = useGLTF('/PinchrCoin.glb')
  useFrame(state => {

    const {position, rotation} = group.current;
    position.y += (Math.sin(1000 + state.clock.elapsedTime) * Math.PI) / 1200;
    rotation.y += 0.02;

  });
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.BezierCurve001.geometry}
        material={materials.Black}
        position={[0, 0, 2.757]}
        rotation={[-1.548, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Text.geometry}
        material={materials.Silver}
        position={[-0.39, -0.473, 0.154]}
        rotation={[1.536, 0, 0]}
        scale={1.502}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Text001.geometry}
        material={nodes.Text001.material}
        position={[-0.39, -0.473, -0.119]}
        rotation={[1.545, 0, 0]}
        scale={1.502}
      />
      <mesh castShadow receiveShadow geometry={nodes.Circle_1.geometry} material={materials.Gold} />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Circle_2.geometry}
        material={materials.Black}
      />
    </group>
  )
}

useGLTF.preload('/PinchrCoin.glb')

// Navbar component

function Navbar() {
    const navigate = useNavigate();
    const [authUser, setAuthUser] = useState(null);  // State to hold the authenticated user object

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see user object for details
                setAuthUser(user);
            } else {
                // User is signed out
                navigate('/signin');
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [navigate]);

    const userSignOut = () => {
        signOut(auth).then(() => {
            navigate('/signin');
        }).catch(error => console.log(error));
    };
    
    return (
        
        <header class="navHeader">
            <nav className="navbar">
            <div className='navHomeDiv'>
                    <Link className="navHome" to="/">
                        <Canvas >
                            <Stage environment="park" contactShadowOpacity={1}>
                                <Resize  >
                                    <Model />
                                </Resize>
                            </Stage>                     
                        </Canvas>
                    </Link></div>
                <ul>
                    <li className="navl"><Link className="nav-profile" to="/profile">Profile</Link></li>
                    <li className="navl"><Link className="nav-link" to="/budget">Budgets</Link></li>   
                    <li className="navl"><Link className="nav-link" to="/analytics">Analytics</Link></li>
                    <li className="navl"><Link className="nav-link" to="/profile">Placeholder</Link></li>   
                </ul>
                <ul className="signout">                   
                    <li className="navl"><Link className="nav-signout" onClick={userSignOut} >Sign Out</Link></li>
                </ul>
            </nav>
        </header>
    );
}
 
export default Navbar;