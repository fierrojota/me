import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './home.css';
import { Header } from '../components/home/Header';
import { Hero } from '../components/home/Hero';
import { Builder } from '../components/home/Builder';
import { FeaturedSystems } from '../components/home/FeaturedSystems';
import { Connect } from '../components/home/Connect';

export function HomePage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash]);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Builder />
        <FeaturedSystems />
        <Connect />
      </main>
    </>
  );
}
