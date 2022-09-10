
import * as SVGLoaders from 'svg-loaders-react';

export default function Loader() {
    return (
        <section className='h-screen w-screen flex justify-center items-center bg-zinc-800'>
            <SVGLoaders.Audio className="fill-green-600" />
        </section>
    );
}