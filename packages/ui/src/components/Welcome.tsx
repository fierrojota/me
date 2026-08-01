import './welcome.css';

export type WelcomeProps = {
  projectName: string;
};

export function Welcome({ projectName }: WelcomeProps) {
  return (
    <div className="welcome">
      <h1 className="welcome__title">{projectName}</h1>
      <p className="welcome__tag">Design System Starter</p>
    </div>
  );
}
