export const toVND = number => {
  return number
    .toString()
    .split('')
    .reverse()
    .reduce((prev, next, index) => {
      return (index % 3 ? next : next + ',') + prev;
    });
};

///////////////////////////

const defaultNumbers = ' hai ba bốn năm sáu bảy tám chín';
const dvBlock = '1 nghìn triệu tỷ'.split(' ');

const chuHangDonVi = ('1 một' + defaultNumbers).split(' ');
const chuHangChuc = ('lẻ mười' + defaultNumbers).split(' ');
const chuHangTram = ('không một' + defaultNumbers).split(' ');

const convertBlockThree = number => {
  if (number === '000') return '';
  const string = number.toString();

  //Kiểm tra độ dài của khối
  switch (string.length) {
    case 0:
      return '';
    case 1:
      return chuHangDonVi[string];
    case 2:
      return convertBlockTwo(string);
    case 3:
      let chuc_dv = '';
      if (string.slice(1, 3) !== '00') {
        chuc_dv = convertBlockTwo(string.slice(1, 3));
      }
      const tram = chuHangTram[string[0]] + ' trăm';
      return tram + ' ' + chuc_dv;
    default:
      break;
  }
};

const convertBlockTwo = number => {
  let dv = chuHangDonVi[number[1]];
  let chuc = chuHangChuc[number[0]];
  let append = '';

  // Nếu chữ số hàng đơn vị là 5
  if (number[0] > 0 && number[1] === 5) {
    dv = 'lăm';
  }

  // Nếu số hàng chục lớn hơn 1
  if (number[0] > 1) {
    append = 'mươi';

    if (number[1] === 1) {
      dv = 'mốt';
    }
  }

  return chuc + ' ' + append + ' ' + dv;
};

export const toVietnamese = number => {
  const str = parseInt(number) + '';
  let i = 0;
  const arr = [];
  let index = str.length;
  const result = [];
  let rsString = '';

  if (index === 0 || str === 'NaN') {
    return '';
  }

  // Chia chuỗi số thành một mảng từng khối có 3 chữ số
  while (index >= 0) {
    arr.push(str.substring(index, Math.max(index - 3, 0)));
    index -= 3;
  }

  // Lặp từng khối trong mảng trên và convert từng khối đấy ra chữ Việt Nam
  for (i = arr.length - 1; i >= 0; i--) {
    if (arr[i] !== '' && arr[i] !== '000') {
      result.push(convertBlockThree(arr[i]));

      // Thêm đuôi của mỗi khối
      if (dvBlock[i]) {
        result.push(dvBlock[i]);
      }
    }
  }

  // Join mảng kết quả lại thành chuỗi string
  rsString = result.join(' ');

  // Trả về kết quả kèm xóa những ký tự thừa
  return (
    rsString
      .replace(/[0-9]/g, '')
      .replace(/ /g, ' ')
      .replace(/ $/, '')
      .replace('  ', ' ') + ' đồng chẵn ./.'
  );
};
