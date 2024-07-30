import Services from "../services/services"

export default function SectionThree(){
    return(
        <div className="sectionThreeWrapper">
            <div className="sectionThreeLeft">
                <h1>Our Vision</h1>
                <h2>Top Minds. One network. </h2>
                <h2>Show off your alma mater and join an elite network of the top 1% of global intellectual capital. 
                </h2>
            </div>
            <div className="sectionThreeRight">
                <Services></Services>
            </div>
        </div>
    )
}