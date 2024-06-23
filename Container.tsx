import { HTMLAttributes } from 'react';

export default function Container({
  style,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      style={{
        ...style,
        // Slide contents vertically centered instead
        // of ReMDX default top-aligned with 'flex-start'
        justifyContent: 'center',
        // Padding based on screen dimensions instead
        // of ReMDX default 48px
        padding: '5vh 8vw',
      }}
      {...props}
    />
  );
}
