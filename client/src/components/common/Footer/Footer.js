import { Link } from 'react-router-dom';

import { Row, Col } from 'reactstrap';

import classs from './Footer.module.css';

const footerData = [
  {
    id: 'footer1',
    title: 'CUSTOMER SERVICES',
    values: [
      'Help & Contact Us',
      'Returns & Refunds',
      'Online Stores',
      'Terms & Conditions',
    ],
    link: '#',
  },
  {
    id: 'footer2',
    title: 'COMPANY',
    values: [
      'What We Do',
      'Available Services',
      'Latest Posts',
      'FAQs',
    ],
    link: '#',
  },
  {
    id: 'footer3',
    title: 'SOCIAL MEDIA',
    values: [
      'Twitter',
      'Instagram',
      'Facebool',
      'Pinterest',
    ],
    link: '#',
  },
];

// định hình footer
const Footer = () => {
  return (
    <Row className={classs.footer}>
      <Row>
        {footerData.map(col => (
          <Col
            className={classs.col}
            key={col.id}
            title={col.title}
            values={col.values}>
            <h5>{col.title}</h5>
            {col.values.map(value => (
              <Link to={col.link} key={value}>
                <p>{value}</p>
              </Link>
            ))}
          </Col>
        ))}
      </Row>
    </Row>
  );
};

export default Footer;
