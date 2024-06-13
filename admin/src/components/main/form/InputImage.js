import React, { useEffect, useState } from 'react';
// import validator from 'validator';
import { generateBase64FromImage } from '../../../untils/image';
import URL from '../../../untils/url';

import styles from './Form.module.css';

const ImageInput = props => {
  const inputImage = [
    {
      type: 'file',
      id: 'image',
      value: '',
    },
  ];

  const [inputArr, setInputArr] = useState(inputImage);
  const [inputFileArr, setInputFileArr] = useState(inputImage);

  useEffect(() => {
    const fileAvailable = [];
    const imageAvailable = [];

    props.editItem &&
      props.editItem.images.map((item, i) => {
        fileAvailable.push({
          type: 'url',
          id: `image-${i++}`,
          value: `${item.replace('\\', '/')}`,
        });
        imageAvailable.push({
          type: 'url',
          id: `image-${i++}`,
          value: `${URL.LOCAL}/${item.replace('\\', '/')}`,
        });
        return item;
      });

    setInputFileArr(() => {
      return [...fileAvailable];
    });
    setInputArr(() => {
      return [...imageAvailable];
    });
  }, [props.editItem]);

  const uploadImage = event => {
    event.preventDefault();
    const fileAvailable = [];
    const imageAvailable = [];

    if (props.editItem) {
      props.editItem.images.map((item, i) => {
        fileAvailable.push({
          type: 'url',
          id: `image-${i++}`,
          value: `${item.replace('\\', '/')}`,
        });
        imageAvailable.push({
          type: 'url',
          id: `image-${i++}`,
          value: `${URL.LOCAL}/${item.replace('\\', '/')}`,
        });
        return item;
      });
    }

    if (event.target.files) {
      const files = Object.values(event.target.files);

      files.map((file, i) => {
        fileAvailable.push({ type: 'file', id: `image-${i++}`, value: file });
        setInputFileArr(editFile => {
          return [...fileAvailable];
        });

        generateBase64FromImage(file)
          .then(b64 => {
            imageAvailable.push({
              type: 'file',
              id: `image-${i++}`,
              value: b64,
            });
          })
          .then(() => {
            setInputArr(editFile => {
              return [...imageAvailable];
            });
          })
          .catch(err => {
            console.log(err);
          });

        return file;
      });
    }
  };

  const removeImg = event => {
    event.preventDefault();

    const updatedImg = [...inputArr];
    const updatedFile = [...inputFileArr];
    const imgRemoveIndex = updatedImg.findIndex(
      img => img.value === event.target.id
    );

    updatedImg.splice(imgRemoveIndex, 1);
    updatedFile.splice(imgRemoveIndex, 1);

    setInputArr(() => {
      return [...updatedImg];
    });
    setInputFileArr(() => {
      return [...updatedFile];
    });
  };

  useEffect(() => {
    const fileArr = [...inputFileArr];

    const photos = fileArr.map(item => {
      return item.value;
    });

    props.parentCallback(photos);
  }, [inputFileArr]);

  return (
    <>
      <div className={styles.formColItem}>
        <label>Image</label>
        <input
          onChange={uploadImage}
          name='images'
          type='file'
          accept='image/*'
          multiple
        />

        <div className={styles.imgArr}>
          {inputArr.map((item, i) => {
            const alt = `${
              props.editItem &&
              (props.editItem.name?.toLowerCase().replaceAll(' ', '-') ||
                props.editItem.title.toLowerCase().replaceAll(' ', '-'))
            }--image-${i}`;

            return (
              <div key={i} className={styles.imgItem}>
                {item.value && (
                  <>
                    <span
                      onClick={removeImg}
                      className={styles.imgX}
                      id={item.value}>
                      X
                    </span>

                    <img alt={alt} src={item.value} />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ImageInput;
