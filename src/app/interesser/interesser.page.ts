import {Component, OnInit, NgZone} from '@angular/core';
import {Router} from "@angular/router";
import {TjommisHubService, InterestItem} from "../services/tjommis-hub.service";


@Component({
    selector: 'app-interesser',
    templateUrl: './interesser.page.html',
    styleUrls: ['./interesser.page.scss'],
})
export class InteresserPage implements OnInit {
    items: any;
    url: string;

    public categories: Set<string> = new Set<string>();
    public activeCategory: string;
    public tags: Set<InterestItem> = new Set<InterestItem>();
    public selectedTags: string[] = [];

    constructor(
        public router: Router,
        public tjommisHub: TjommisHubService,
        public zone: NgZone
    ) {
    }

    public isTagSelected(tag: InterestItem): boolean {
        if (this.selectedTags.includes(tag.name)) return true;
        return false;
    }

    ionViewWillEnter() {
        console.log("ConnectionInfoObject: ", this.tjommisHub.connectionInfo);
        this.categories = new Set<string>(Array.from(this.tjommisHub.connectionInfo.interestList, e => e.category));
        this.selectedTags = this.tjommisHub.connectionInfo.userInfo.interests;
        console.log("Categories:", this.categories, "selections", this.selectedTags);
    }


    setActiveCategory(category: string) {
        this.activeCategory = category;
        this.zone.run(() => {

            let result = this.tjommisHub.connectionInfo.interestList.filter(e => e.category.includes(this.activeCategory));

            this.tags = new Set(
                Array.from(
                    result
                )
            );
        });
    }

    addTag(tag: InterestItem) {
        console.log("addTag");
        this.zone.run(() => {
            this.selectedTags.includes(tag.name) ? this.selectedTags = this.selectedTags.filter(e => e != tag.name) : this.selectedTags.push(tag.name);
            console.log("Selected tags: ", this.selectedTags);
        });
    }

    saveInterests() {
        this.tjommisHub.updateInterests(this.selectedTags);
        this.router.navigateByUrl('/profile');
    }

    ngOnInit() {
    }

    getTagsStatus() {
        return this.tags.size > 0;
    }
}

/*

  getData()
  {

        this.items = [
            {"title": "Gaming",
                 "tag": ["#PS4", "#XBOX", "#PC","#LoL", "#Dota2", "#WoW"]
            },
            {"title": "Skole",
                "tag":["#Kollokvie", "#Eksamen", "#Tips", "Events","#Skolebøker",]
            },
            {"title": "Idrett",
                "tag": ["#Fotball", "#Vektløfting", "#Løping", "#Speedwalking", "#Basketball"]
            },
            {"title": "Teknologi",
                "tag": ["#Programmering", "#Windows", "#Linux", "#IT","#Java", "#Javascript"]
            },
            {"title": "Mat",
                "tag": ["#Schnitzler", "#Pizza", "#Kebab", "#Øl","#Sprit", "#Vin"]
            } ,
            {"title": "Musikk",
                "tag": ["#Pop", "#Rock", "#Rap", "#Metall","#Techno", "#RnB", "Vapourwave"]
            },
            {"title": "Litteratur",
                "tag": ["#Alf Prøysen", "#J.K Rowling", "#R.R Tolkien", "#Dan Abnett"]
            },
            {"title": "Jobb",
                "tag": ["#CV", "#Internship", "#Jobbsøknad", "#Konferanser", "#Workshops"]
            },
            {"title": "Fest",
                "tag": ["#Vorspiel", "#Nachspiel", "#Hjemmefest", "#Låvefest", "#Alkoholfritt"]
            },
            ]
  }*/
