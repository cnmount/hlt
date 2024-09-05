import Image from 'next/image'
import styles from '../styles/Footer.module.css'

const Footer = () => {
    return (
        <div className={styles.container} id="footer">
            <div className={styles.item}>
                <Image src="/images/pizza-footer.jpg" layout='fill' alt='' objectFit='cover'></Image>
                {/* Photo by <a href="https://unsplash.com/@shaianramesht?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">shaian ramesht</a> on <a href="https://unsplash.com/s/photos/pizza?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a> */}
  
            </div>
            <div className={styles.item}>
              <div className={styles.card}>
                  <h2 className={styles.motto} id="motto">
                      {`BEST PIZZA IN TOWN?`} <br/>
                      {`IT'S UNI PIZZA.`} <br/>
                      {`JUST THE FACTS!`}
                  </h2>
              </div>
              <div className={styles.card}>
                  <h1 className={styles.title} id='footer-heading'>FIND OUR RESTAURANTS</h1>
                  <p className={styles.text}>
                      the University of Waikato. 
                      <br />Hamilton, 3216
                      <br />064-527-5277
                  </p>
                  <h1 className={styles.title} id='footer-heading'>BOOKING BY EMAIL</h1>
                  <p className={styles.text}>
                      fzahid@waikato.ac.nz
                  </p>
              </div>
              <div className={styles.card}>
              <h1 className={styles.title}>HOURS</h1>
              <p className={styles.text}>
                      MONDAY - SATURDAY
                      <br />11:00AM - 10:00PM
                      
                  </p>
              </div>
            </div>
        </div>
    )
}

export default Footer
