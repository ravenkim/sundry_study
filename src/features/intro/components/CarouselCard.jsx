import TitleWithSubtitle from 'src/features/intro/components/TitleWithSubtitle.jsx'


const CarouselCard = ({ titles, description, imgUlr }) => {
  return (
      <div
          className={`flex w-full flex-col items-center justify-center`}
      >
        <TitleWithSubtitle titles={titles} description={description} />
        <div className={`w-full max-w-md flex justify-center my-[64px]`}>
          <img src={imgUlr} alt="intro image" 
          
          />
          
        </div>

      </div>
  )
}

export default CarouselCard