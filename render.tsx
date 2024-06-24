import { Deck, MDXProvider, Slide, Transitions } from '@nkzw/remdx/index.js';
import { ReMDXModule } from '@nkzw/remdx/types.jsx';
import { createRoot, Root } from 'react-dom/client';

// Copy the Image component from ReMDX, because it is not exported
function Image({
  src: source,
  ...props
}: React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>) {
  if (!source) {
    return null;
  }
  const [src, query] = source.split('?');
  return (
    <img
      loading="lazy"
      src={src}
      style={Object.fromEntries(new URLSearchParams(query))}
      {...props}
    />
  );
}

async function slidesToComponent(module: Promise<ReMDXModule>) {
  const {
    Components,
    Container,
    Themes,
    Transitions: slidesTransitions,
    default: slides,
  } = await module;
  return (
    <MDXProvider
      components={{
        // Copy the default components (...DefaultComponents)
        // from ReMDX, because they are not exported
        img: Image,

        ...Components,
      }}
    >
      <Deck
        slides={slides.map(({ Component, data }, index) => (
          <Slide
            container={Container}
            id={index}
            image={data?.image}
            key={index}
            style={Themes?.[data?.theme] || Themes?.default}
            transition={
              slidesTransitions?.[data?.transition] ||
              Transitions[data?.transition] ||
              undefined
            }
          >
            <Component />
          </Slide>
        ))}
      />
    </MDXProvider>
  );
}

const roots = new WeakMap<HTMLElement, Root>();

export async function render(
  element: HTMLElement | null,
  module: Promise<ReMDXModule>,
) {
  if (!element) {
    throw new Error(`remdx: The provided DOM node could not be found.`);
  }

  if (!roots.has(element)) {
    roots.set(element, createRoot(element));
  }

  roots.get(element)?.render(await slidesToComponent(module));
}
