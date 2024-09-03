import React, { useState } from 'react';
import github from './assets/images/github.svg';
import linkedin from './assets/images/linkedin.svg';

interface ImageState {
  image: File | null;
  imageUrl: string;
  imagePreview: string; // Add this to store the image preview
}

interface CaptionState {
  caption: string;
}

const App: React.FC = () => {
  const [image, setImage] = useState<ImageState>({
    image: null,
    imageUrl: '',
    imagePreview: '1',
  });
  const [caption, setCaption] = useState<CaptionState>({
    caption: 'Upload image to generate caption',
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImage({
      image: event.target.files![0],
      imageUrl: '',
      imagePreview: URL.createObjectURL(event.target.files![0]),
    });
  };

  const handleImageUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImage({
      image: null,
      imageUrl: event.target.value,
      imagePreview: '1',
    });
  };

  const handleGenerateCaption = () => {
    setCaption({ caption: 'Loading.....' });
    if (image.image) {
      const formData = new FormData();
      formData.append('image', image.image!);

      fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          setCaption({ caption: data.caption });
        })
        .catch((error) => {
          setCaption({ caption: error });
        });
    } else if (image.imageUrl) {
      fetch(`http://localhost:5000/predict?url=${image.imageUrl}`, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((data) => {
          setCaption({ caption: data.caption });
        })
        .catch((error) => {
          setCaption({ caption: error });
        });
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-black pb-4">
      <nav className="fixed top-10 rounded border-4 border-double  border-rose-500 bg-red-950 px-4 py-2 text-2xl font-bold text-white sm:top-0 ">
        Wasef Arabic image caption generator created by Mo Adeeb Alkahat{' '}
        <a href="https://github.com/Mo-Adeeb-Alkahat">
          <img src={github} alt="github" className="mx-2 inline h-5 w-5" />
        </a>
        <a href="https://www.linkedin.com/in/mo-adeeb-alkahat/">
          <img src={linkedin} alt="likedin" className="inline h-6 w-6" />
        </a>
      </nav>

      {image.imagePreview && (
        <img
          src={image.imagePreview}
          alt=""
          className="border-dark-700 mt-4 h-80 w-5/6 rounded-lg border-4 object-fill  indent-[9999px] sm:h-64 sm:w-3/6 "
        />
      )}

      <p className=" mb-10 w-5/6 rounded-xl bg-gray-600 p-2 text-center text-lg text-white sm:w-3/6 ">
        {caption.caption}
      </p>
      <div>
        <label
          htmlFor="image_uploads"
          className="w-4/6 rounded-lg border-4 border-double border-sky-500 bg-sky-950 p-2 text-white"
        >
          upload image
        </label>
        <input
          type="file"
          id="image_uploads"
          name="image_uploads"
          accept=".jpg, .jpeg, .png"
          onChange={handleImageChange}
          className="sr-only"
        />
      </div>
      <h4 className="text-2xl text-white">OR</h4>
      <input
        type="text"
        placeholder="Enter image URL"
        value={image.imageUrl}
        onChange={handleImageUrlChange}
        className="w-4/6 rounded-lg border-4 border-double border-sky-500 bg-sky-950 p-2 text-white sm:w-3/6  "
      />
      <button
        onClick={handleGenerateCaption}
        className="mt-10 rounded border-4 border-double border-rose-500 bg-red-950 px-4 py-2 font-bold text-white hover:bg-red-700"
      >
        Generate Caption
      </button>
    </div>
  );
};

export default App;
